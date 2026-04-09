"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toBoolean, toNullableString } from "@/lib/utils";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { sendManualConversationReply } from "@/server/services/conversation-messaging";
import type { ActionState } from "@/types/actions";
import type { ConversationStatus } from "@/types/database";

const conversationStatuses = new Set(["open", "pending_human", "automated", "closed"]);

async function ensureAssignableConversationUser(tenantId: string, userId: string | null) {
	if (!userId) return true;

	const assignableUsers = await getAssignableTenantUsers(tenantId);
	return assignableUsers.some((user) => user.user_id === userId);
}

export async function updateConversationRoutingAction(
	conversationId: string,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const { activeTenant } = await getActiveTenantContext();
	const supabase = await createSupabaseServerClient();
	const assignedTo = toNullableString(formData.get("assigned_to"));
	const status = formData.get("status")?.toString() ?? "open";
	const handoffReason = toNullableString(formData.get("handoff_reason"));
	const aiEnabled = toBoolean(formData.get("ai_enabled"));

	if (!conversationStatuses.has(status)) {
		return {
			status: "error",
			message: "El estado de conversación seleccionado no es válido.",
		};
	}

	if (!(await ensureAssignableConversationUser(activeTenant.id, assignedTo))) {
		return {
			status: "error",
			message: "El asesor seleccionado no pertenece al tenant o no puede recibir asignaciones.",
		};
	}

	const closedAt = status === "closed" ? new Date().toISOString() : null;

	const { error } = await supabase
		.from("conversations")
		.update({
			assigned_to: assignedTo,
			status: status as ConversationStatus,
			handoff_reason: handoffReason,
			ai_enabled: aiEnabled,
			closed_at: closedAt,
		})
		.eq("tenant_id", activeTenant.id)
		.eq("id", conversationId);

	if (error) {
		return { status: "error", message: error.message };
	}

	revalidatePath("/dashboard/conversations");
	revalidatePath(`/dashboard/conversations/${conversationId}`);

	return {
		status: "success",
		message: "Routing conversacional actualizado.",
	};
}

export async function sendConversationReplyAction(
	conversationId: string,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const { activeTenant, user } = await getActiveTenantContext();
	const content = formData.get("content")?.toString() ?? "";

	if (!content.trim()) {
		return {
			status: "error",
			message: "Escribí un mensaje antes de enviarlo.",
		};
	}

	try {
		await sendManualConversationReply({
			tenantId: activeTenant.id,
			conversationId,
			userId: user.id,
			content,
		});
	} catch (error) {
		return {
			status: "error",
			message: error instanceof Error ? error.message : "No se pudo enviar el mensaje.",
		};
	}

	revalidatePath("/dashboard/conversations");
	revalidatePath(`/dashboard/conversations/${conversationId}`);

	return {
		status: "success",
		message: "Mensaje enviado por WhatsApp.",
	};
}

export async function updateConversationLinksAction(
	conversationId: string,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const { activeTenant } = await getActiveTenantContext();
	const supabase = await createSupabaseServerClient();
	const leadId = toNullableString(formData.get("lead_id"));
	const propertyId = toNullableString(formData.get("property_id"));

	if (leadId) {
		const { data: lead, error: leadError } = await supabase
			.from("leads")
			.select("id")
			.eq("tenant_id", activeTenant.id)
			.eq("id", leadId)
			.maybeSingle();

		if (leadError || !lead) {
			return {
				status: "error",
				message: leadError?.message ?? "El lead seleccionado no existe en este tenant.",
			};
		}
	}

	if (propertyId) {
		const { data: property, error: propertyError } = await supabase
			.from("properties")
			.select("id")
			.eq("tenant_id", activeTenant.id)
			.eq("id", propertyId)
			.maybeSingle();

		if (propertyError || !property) {
			return {
				status: "error",
				message:
					propertyError?.message ?? "La propiedad seleccionada no existe en este tenant.",
			};
		}
	}

	const { error } = await supabase
		.from("conversations")
		.update({
			lead_id: leadId,
			property_id: propertyId,
		})
		.eq("tenant_id", activeTenant.id)
		.eq("id", conversationId);

	if (error) {
		return {
			status: "error",
			message: error.message,
		};
	}

	revalidatePath("/dashboard/conversations");
	revalidatePath(`/dashboard/conversations/${conversationId}`);

	return {
		status: "success",
		message: "Vínculos de conversación actualizados.",
	};
}
