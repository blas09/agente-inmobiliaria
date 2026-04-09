"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toNullableString, zonedDateTimeLocalToUtcIso } from "@/lib/utils";
import { getActiveTenantContext, requireTenantAdminContext } from "@/server/auth/tenant-context";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import type { ActionState } from "@/types/actions";
import type { AppointmentStatus } from "@/types/database";
import { appointmentSchema } from "@/features/appointments/schema";
import {
	appointmentRulesSchema,
	getAppointmentRules,
	mergeAppointmentRulesIntoSettings,
	summarizeAppointmentRules,
	validateAppointmentLocalDateTime,
} from "@/features/appointments/rules";

function requiresPlannedScheduleValidation(status: AppointmentStatus) {
	return status === "scheduled" || status === "confirmed";
}

async function ensureAssignableAdvisor(tenantId: string, advisorId: string | null) {
	if (!advisorId) return true;

	const assignableUsers = await getAssignableTenantUsers(tenantId);
	return assignableUsers.some((user) => user.user_id === advisorId);
}

function parseAppointmentFormData(formData: FormData, timeZone: string) {
	const propertyId = toNullableString(formData.get("property_id"));
	const advisorId = toNullableString(formData.get("advisor_id"));
	const scheduledAtLocal = formData.get("scheduled_at")?.toString() ?? "";
	const result = appointmentSchema.safeParse({
		scheduled_at: scheduledAtLocal,
		status: formData.get("status"),
		property_id: propertyId,
		advisor_id: advisorId,
		notes: toNullableString(formData.get("notes")) ?? undefined,
	});

	if (!result.success) {
		return result;
	}

	const scheduledAt = zonedDateTimeLocalToUtcIso(result.data.scheduled_at, timeZone);

	if (!scheduledAt) {
		return {
			success: false as const,
			error: {
				flatten: () => ({
					fieldErrors: {
						scheduled_at: ["La fecha y hora no tienen un formato válido."],
					},
				}),
			},
		};
	}

	return {
		success: true as const,
		data: {
			...result.data,
			scheduled_at: scheduledAt,
		},
	};
}

function parseAppointmentRulesFormData(formData: FormData) {
	return appointmentRulesSchema.safeParse({
		default_duration_minutes: formData.get("default_duration_minutes"),
		buffer_minutes: formData.get("buffer_minutes"),
		advance_notice_hours: formData.get("advance_notice_hours"),
		business_hours_start: formData.get("business_hours_start")?.toString() ?? "",
		business_hours_end: formData.get("business_hours_end")?.toString() ?? "",
		working_days: formData.getAll("working_days"),
	});
}

function revalidateAppointmentPaths(paths: string[]) {
	const uniquePaths = Array.from(new Set(["/dashboard/appointments", ...paths]));
	uniquePaths.forEach((path) => revalidatePath(path));
}

export async function createAppointmentAction(
	leadId: string,
	paths: string[],
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const { activeTenant } = await getActiveTenantContext();
	const supabase = await createSupabaseServerClient();
	const result = parseAppointmentFormData(formData, activeTenant.timezone);
	const appointmentRules = getAppointmentRules(activeTenant.settings);

	if (!result.success) {
		return {
			status: "error",
			message: "Hay campos inválidos en la visita.",
			fieldErrors: result.error.flatten().fieldErrors,
		};
	}

	if (requiresPlannedScheduleValidation(result.data.status as AppointmentStatus)) {
		const localValidationError = validateAppointmentLocalDateTime(
			formData.get("scheduled_at")?.toString() ?? "",
			appointmentRules,
		);
		if (localValidationError) {
			return {
				status: "error",
				message: localValidationError,
				fieldErrors: {
					scheduled_at: [localValidationError],
				},
			};
		}

		const scheduledAtDate = new Date(result.data.scheduled_at);
		const minimumAllowedDate = new Date(Date.now() + appointmentRules.advance_notice_hours * 60 * 60 * 1000);
		if (scheduledAtDate.getTime() < minimumAllowedDate.getTime()) {
			return {
				status: "error",
				message: "La visita no respeta el aviso mínimo configurado para el tenant.",
				fieldErrors: {
					scheduled_at: ["La visita no respeta el aviso mínimo configurado para el tenant."],
				},
			};
		}
	}

	const { data: lead, error: leadError } = await supabase
		.from("leads")
		.select("id")
		.eq("tenant_id", activeTenant.id)
		.eq("id", leadId)
		.maybeSingle();

	if (leadError || !lead) {
		return {
			status: "error",
			message: leadError?.message ?? "El lead ya no existe en este tenant.",
		};
	}

	if (result.data.property_id) {
		const { data: property, error: propertyError } = await supabase
			.from("properties")
			.select("id")
			.eq("tenant_id", activeTenant.id)
			.eq("id", result.data.property_id)
			.maybeSingle();

		if (propertyError || !property) {
			return {
				status: "error",
				message: propertyError?.message ?? "La propiedad seleccionada no existe en este tenant.",
			};
		}
	}

	if (!(await ensureAssignableAdvisor(activeTenant.id, result.data.advisor_id))) {
		return {
			status: "error",
			message: "El asesor seleccionado no pertenece al tenant o no puede recibir asignaciones.",
		};
	}

	const { error } = await supabase.from("appointments").insert({
		tenant_id: activeTenant.id,
		lead_id: leadId,
		property_id: result.data.property_id,
		advisor_id: result.data.advisor_id,
		scheduled_at: result.data.scheduled_at,
		status: result.data.status,
		notes: result.data.notes ?? null,
	});

	if (error) {
		return {
			status: "error",
			message: error.message,
		};
	}

	revalidateAppointmentPaths(paths);

	return {
		status: "success",
		message: "Visita agendada.",
	};
}

export async function updateAppointmentAction(
	appointmentId: string,
	paths: string[],
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const { activeTenant } = await getActiveTenantContext();
	const supabase = await createSupabaseServerClient();
	const result = parseAppointmentFormData(formData, activeTenant.timezone);
	const appointmentRules = getAppointmentRules(activeTenant.settings);

	if (!result.success) {
		return {
			status: "error",
			message: "Hay campos inválidos en la visita.",
			fieldErrors: result.error.flatten().fieldErrors,
		};
	}

	if (requiresPlannedScheduleValidation(result.data.status as AppointmentStatus)) {
		const localValidationError = validateAppointmentLocalDateTime(
			formData.get("scheduled_at")?.toString() ?? "",
			appointmentRules,
		);
		if (localValidationError) {
			return {
				status: "error",
				message: localValidationError,
				fieldErrors: {
					scheduled_at: [localValidationError],
				},
			};
		}

		const scheduledAtDate = new Date(result.data.scheduled_at);
		const minimumAllowedDate = new Date(Date.now() + appointmentRules.advance_notice_hours * 60 * 60 * 1000);
		if (scheduledAtDate.getTime() < minimumAllowedDate.getTime()) {
			return {
				status: "error",
				message: "La visita no respeta el aviso mínimo configurado para el tenant.",
				fieldErrors: {
					scheduled_at: ["La visita no respeta el aviso mínimo configurado para el tenant."],
				},
			};
		}
	}

	const { data: currentAppointment, error: appointmentError } = await supabase
		.from("appointments")
		.select("id, lead_id")
		.eq("tenant_id", activeTenant.id)
		.eq("id", appointmentId)
		.maybeSingle();

	if (appointmentError || !currentAppointment) {
		return {
			status: "error",
			message: appointmentError?.message ?? "La visita ya no existe en este tenant.",
		};
	}

	if (result.data.property_id) {
		const { data: property, error: propertyError } = await supabase
			.from("properties")
			.select("id")
			.eq("tenant_id", activeTenant.id)
			.eq("id", result.data.property_id)
			.maybeSingle();

		if (propertyError || !property) {
			return {
				status: "error",
				message: propertyError?.message ?? "La propiedad seleccionada no existe en este tenant.",
			};
		}
	}

	if (!(await ensureAssignableAdvisor(activeTenant.id, result.data.advisor_id))) {
		return {
			status: "error",
			message: "El asesor seleccionado no pertenece al tenant o no puede recibir asignaciones.",
		};
	}

	const { error } = await supabase
		.from("appointments")
		.update({
			property_id: result.data.property_id,
			advisor_id: result.data.advisor_id,
			scheduled_at: result.data.scheduled_at,
			status: result.data.status as AppointmentStatus,
			notes: result.data.notes ?? null,
		})
		.eq("tenant_id", activeTenant.id)
		.eq("id", appointmentId);

	if (error) {
		return {
			status: "error",
			message: error.message,
		};
	}

	revalidateAppointmentPaths([...paths, `/dashboard/leads/${currentAppointment.lead_id}`]);

	return {
		status: "success",
		message: "Visita actualizada.",
	};
}

export async function updateAppointmentRulesAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const { activeTenant } = await requireTenantAdminContext();
	const supabase = await createSupabaseServerClient();
	const result = parseAppointmentRulesFormData(formData);

	if (!result.success) {
		return {
			status: "error",
			message: "Hay campos inválidos en las reglas de agenda.",
			fieldErrors: result.error.flatten().fieldErrors,
		};
	}

	if (result.data.business_hours_start >= result.data.business_hours_end) {
		return {
			status: "error",
			message: "El horario de fin debe ser posterior al horario de inicio.",
			fieldErrors: {
				business_hours_end: ["El horario de fin debe ser posterior al horario de inicio."],
			},
		};
	}

	const { error } = await supabase
		.from("tenants")
		.update({
			settings: mergeAppointmentRulesIntoSettings(activeTenant.settings, result.data),
		})
		.eq("id", activeTenant.id);

	if (error) {
		return {
			status: "error",
			message: error.message,
		};
	}

	revalidatePath("/dashboard/settings");
	revalidatePath("/dashboard/appointments");

	return {
		status: "success",
		message: `Reglas de agenda actualizadas. ${summarizeAppointmentRules(result.data)}`,
	};
}
