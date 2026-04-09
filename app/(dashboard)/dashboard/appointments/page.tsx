import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { AppointmentForm } from "@/features/appointments/appointment-form";
import { updateAppointmentAction } from "@/features/appointments/actions";
import { getAppointmentRules, summarizeAppointmentRules } from "@/features/appointments/rules";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listAppointments } from "@/server/queries/appointments";
import { listAvailablePropertiesForSelection } from "@/server/queries/properties";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { formatDateTime } from "@/lib/utils";

export default async function AppointmentsPage({
	searchParams,
}: {
	searchParams: Promise<{ status?: string; advisor?: string }>;
}) {
	const params = await searchParams;
	const { activeTenant } = await getActiveTenantContext();
	const appointmentRules = getAppointmentRules(activeTenant.settings);
	const [appointments, advisors, properties] = await Promise.all([
		listAppointments(activeTenant.id, { status: params.status, advisorId: params.advisor }),
		getAssignableTenantUsers(activeTenant.id),
		listAvailablePropertiesForSelection(activeTenant.id),
	]);

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h1 className="text-foreground text-5xl leading-none font-semibold tracking-tight">Agenda</h1>
				<p className="max-w-3xl text-lg text-muted-foreground">
					Visitas internas del tenant. La agenda propia sigue siendo la verdad de negocio.
				</p>
			</div>
			<DashboardTopCards
				items={[
					{ key: "total", label: "Visitas", value: appointments.length, tone: "primary" },
					{
						key: "confirmed",
						label: "Confirmadas",
						value: appointments.filter((appointment) => appointment.status === "confirmed").length,
						tone: "success",
					},
					{
						key: "scheduled",
						label: "Pendientes",
						value: appointments.filter((appointment) => appointment.status === "scheduled").length,
						tone: "warning",
					},
				]}
			/>
			<CardBox>
				<CardHeader>
					<CardTitle>Reglas activas de agenda</CardTitle>
					<CardDescription>Validaciones del tenant aplicadas al crear o editar visitas.</CardDescription>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					{summarizeAppointmentRules(appointmentRules)} · aviso mínimo{" "}
					{appointmentRules.advance_notice_hours} h · timezone {activeTenant.timezone}
				</CardContent>
			</CardBox>
			{appointments.length === 0 ? (
				<EmptyState
					title="No hay visitas cargadas"
					description="Podés agendarlas desde un lead o una conversación con lead vinculado."
					actionHref="/dashboard/leads"
					actionLabel="Ir a leads"
				/>
			) : (
				<div className="grid gap-6">
					{appointments.map((appointment) => (
						<div key={appointment.id} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
							<CardBox>
								<CardHeader>
									<CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
										<span>
											{appointment.lead?.full_name ?? "Lead no disponible"}
										</span>
										<Badge
											variant={
												appointment.status === "confirmed"
													? "success"
													: appointment.status === "canceled"
														? "destructive"
														: "outline"
											}
										>
											{appointment.status}
										</Badge>
									</CardTitle>
									<CardDescription>
										{appointment.lead?.phone ?? appointment.lead?.email ?? "Sin contacto"} ·{" "}
										{appointment.property?.title ??
											(appointment.property_id ? "Propiedad no disponible" : "Sin propiedad")}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3 text-sm">
									<div className="flex justify-between gap-3">
										<span className="text-muted-foreground">Fecha</span>
										<span>{formatDateTime(appointment.scheduled_at)}</span>
									</div>
									<div className="flex justify-between gap-3">
										<span className="text-muted-foreground">Asesor</span>
										<span>
											{appointment.advisor?.full_name ?? appointment.advisor?.email ?? "Sin asignar"}
										</span>
									</div>
									<div className="flex justify-between gap-3">
										<span className="text-muted-foreground">Propiedad</span>
										<span>
											{appointment.property?.title ??
												(appointment.property_id ? "Propiedad no disponible" : "Sin propiedad")}
										</span>
									</div>
									<div className="flex justify-between gap-3">
										<span className="text-muted-foreground">Contacto</span>
										<span>{appointment.lead?.phone ?? appointment.lead?.email ?? "Sin contacto"}</span>
									</div>
									{appointment.notes ? (
										<div className="rounded-xl border border-border bg-lightprimary p-4">
											<p className="text-muted-foreground">Notas</p>
											<p className="mt-1">{appointment.notes}</p>
										</div>
									) : null}
									<div className="flex gap-3 text-sm">
										<Link className="text-primary hover:underline" href={`/dashboard/leads/${appointment.lead_id}`}>
											Ver lead
										</Link>
										{appointment.property_id ? (
											<Link
												className="text-primary hover:underline"
												href={`/dashboard/properties/${appointment.property_id}`}
											>
												Ver propiedad
											</Link>
										) : null}
									</div>
								</CardContent>
							</CardBox>
							<AppointmentForm
								action={updateAppointmentAction.bind(null, appointment.id, ["/dashboard/appointments"])}
								advisorOptions={advisors.map((advisor) => ({
									id: advisor.user_id,
									label:
										advisor.user_profiles?.full_name ?? advisor.user_profiles?.email ?? advisor.user_id,
									role: advisor.role,
								}))}
								initialValues={{
									scheduled_at: appointment.scheduled_at,
									status: appointment.status,
									property_id: appointment.property_id,
									advisor_id: appointment.advisor_id,
									notes: appointment.notes,
								}}
								propertyOptions={properties.map((property) => ({
									id: property.id,
									label: `${property.title}${property.external_ref ? ` · ${property.external_ref}` : ""}`,
								}))}
								rulesSummary={summarizeAppointmentRules(appointmentRules)}
								submitLabel="Actualizar visita"
								timezone={activeTenant.timezone}
								title="Gestión de la visita"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
