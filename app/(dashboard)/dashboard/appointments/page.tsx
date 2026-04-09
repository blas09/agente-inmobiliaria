import Link from "next/link";

import { AppointmentForm } from "@/features/appointments/appointment-form";
import { updateAppointmentAction } from "@/features/appointments/actions";
import { getAppointmentRules, summarizeAppointmentRules } from "@/features/appointments/rules";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
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
		<>
			<PageHeader
				title="Agenda"
				description="Visitas internas del tenant. La agenda propia sigue siendo la verdad de negocio."
			>
				<form className="flex flex-col gap-2 md:flex-row">
					<Select defaultValue={params.status ?? "all"} name="status">
						<option value="all">Todos los estados</option>
						<option value="scheduled">Agendadas</option>
						<option value="confirmed">Confirmadas</option>
						<option value="completed">Completadas</option>
						<option value="canceled">Canceladas</option>
						<option value="no_show">No asistió</option>
					</Select>
					<Select defaultValue={params.advisor ?? "all"} name="advisor">
						<option value="all">Todos los asesores</option>
						{advisors.map((advisor) => (
							<option key={advisor.user_id} value={advisor.user_id}>
								{advisor.user_profiles?.full_name ?? advisor.user_profiles?.email ?? advisor.user_id}
							</option>
						))}
					</Select>
					<Button type="submit" variant="outline">
						Filtrar
					</Button>
				</form>
			</PageHeader>
			<Card>
				<CardHeader>
					<CardTitle>Reglas activas de agenda</CardTitle>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					{summarizeAppointmentRules(appointmentRules)} · aviso mínimo{" "}
					{appointmentRules.advance_notice_hours} h · timezone {activeTenant.timezone}
				</CardContent>
			</Card>
			{appointments.length === 0 ? (
				<EmptyState
					title="No hay visitas cargadas"
					description="Podés agendarlas desde un lead o una conversación con lead vinculado."
				/>
			) : (
				<div className="grid gap-6">
					{appointments.map((appointment) => (
						<div key={appointment.id} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between gap-3">
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
										<div>
											<p className="text-muted-foreground">Notas</p>
											<p className="mt-1">{appointment.notes}</p>
										</div>
									) : null}
									<div className="flex gap-3 text-sm">
										<Link className="text-teal-700 hover:underline" href={`/dashboard/leads/${appointment.lead_id}`}>
											Ver lead
										</Link>
										{appointment.property_id ? (
											<Link
												className="text-teal-700 hover:underline"
												href={`/dashboard/properties/${appointment.property_id}`}
											>
												Ver propiedad
											</Link>
										) : null}
									</div>
								</CardContent>
							</Card>
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
		</>
	);
}
