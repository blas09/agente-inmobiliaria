import Link from "next/link";

import { AppointmentForm } from "@/features/appointments/appointment-form";
import { createAppointmentAction } from "@/features/appointments/actions";
import { getAppointmentRules, summarizeAppointmentRules } from "@/features/appointments/rules";
import { deleteLeadAction, updateLeadRoutingAction } from "@/features/leads/actions";
import { LeadRoutingForm } from "@/features/leads/lead-routing-form";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import {
	getLeadById,
	getLeadConversations,
	getLeadStageHistory,
	getPipelineStages,
} from "@/server/queries/leads";
import { getLeadAppointments } from "@/server/queries/appointments";
import { listAvailablePropertiesForSelection } from "@/server/queries/properties";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { formatDateTime } from "@/lib/utils";

export default async function LeadDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { activeTenant } = await getActiveTenantContext();
	const appointmentRules = getAppointmentRules(activeTenant.settings);
	const [lead, stages, stageHistory, advisors, conversations, appointments, properties] = await Promise.all([
		getLeadById(activeTenant.id, id),
		getPipelineStages(activeTenant.id),
		getLeadStageHistory(activeTenant.id, id),
		getAssignableTenantUsers(activeTenant.id),
		getLeadConversations(activeTenant.id, id),
		getLeadAppointments(activeTenant.id, id),
		listAvailablePropertiesForSelection(activeTenant.id),
	]);
	const stage = stages.find((item) => item.id === lead.pipeline_stage_id);
	const assignedAdvisor = advisors.find((advisor) => advisor.user_id === lead.assigned_to);
	const deleteAction = deleteLeadAction.bind(null, lead.id);
	const appointmentAction = createAppointmentAction.bind(null, lead.id, [
		`/dashboard/leads/${lead.id}`,
		"/dashboard/appointments",
	]);

	return (
		<>
			<PageHeader title={lead.full_name} description={lead.email ?? lead.phone ?? "Sin contacto principal"}>
				<div className="flex gap-3">
					<Link className="text-sm font-medium text-teal-700" href={`/dashboard/leads/${lead.id}/edit`}>
						Editar
					</Link>
					<form action={deleteAction}>
						<Button type="submit" variant="destructive">
							Eliminar
						</Button>
					</form>
				</div>
			</PageHeader>
			<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<Card>
					<CardHeader>
						<CardTitle>Perfil comercial</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Estado</span>
							<Badge variant={lead.qualification_status === "qualified" ? "success" : "outline"}>
								{lead.qualification_status}
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Interés</span>
							<span>{lead.interest_type ?? "Sin definir"}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Score</span>
							<span>{lead.score ?? "-"}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Asesor</span>
							<span>
								{assignedAdvisor?.user_profiles?.full_name ??
									assignedAdvisor?.user_profiles?.email ??
									"Sin asignar"}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Etapa</span>
							<span>{stage?.name ?? "Sin etapa"}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Creado</span>
							<span>{formatDateTime(lead.created_at)}</span>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Contexto y notas</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<p>{lead.notes ?? "Sin notas cargadas."}</p>
						<div className="rounded-lg border border-border bg-slate-50 p-4">
							<p className="font-medium">Derivación humana</p>
							<p className="mt-1 text-muted-foreground">
								{lead.is_human_handoff_required ? "Sí" : "No"}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
				<LeadRoutingForm
					action={updateLeadRoutingAction.bind(null, lead.id)}
					advisorOptions={advisors.map((advisor) => ({
						id: advisor.user_id,
						label: advisor.user_profiles?.full_name ?? advisor.user_profiles?.email ?? advisor.user_id,
						role: advisor.role,
					}))}
					initialValues={{
						assigned_to: lead.assigned_to,
						pipeline_stage_id: lead.pipeline_stage_id,
						qualification_status: lead.qualification_status,
						is_human_handoff_required: lead.is_human_handoff_required,
					}}
					stageOptions={stages.map((stageOption) => ({
						id: stageOption.id,
						name: stageOption.name,
					}))}
				/>
				<Card>
					<CardHeader>
						<CardTitle>Conversaciones asociadas</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						{conversations.length === 0 ? (
							<p className="text-muted-foreground">Todavía no hay conversaciones vinculadas a este lead.</p>
						) : (
							conversations.map((conversation) => (
								<Link
									key={conversation.id}
									className="block rounded-lg border border-border px-4 py-3 transition hover:border-teal-300"
									href={`/dashboard/conversations/${conversation.id}`}
								>
									<p className="font-medium">
										{conversation.contact_display_name ?? "Conversación sin nombre"}
									</p>
									<p className="text-muted-foreground">
										{conversation.status} · {formatDateTime(conversation.last_message_at)}
									</p>
								</Link>
							))
						)}
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
				<AppointmentForm
					action={appointmentAction}
					advisorOptions={advisors.map((advisor) => ({
						id: advisor.user_id,
						label: advisor.user_profiles?.full_name ?? advisor.user_profiles?.email ?? advisor.user_id,
						role: advisor.role,
					}))}
					initialValues={{
						advisor_id: lead.assigned_to,
					}}
					propertyOptions={properties.map((property) => ({
						id: property.id,
						label: `${property.title}${property.external_ref ? ` · ${property.external_ref}` : ""}`,
					}))}
					rulesSummary={summarizeAppointmentRules(appointmentRules)}
					submitLabel="Agendar visita"
					timezone={activeTenant.timezone}
					title="Agenda interna"
				/>
				<Card>
					<CardHeader>
						<CardTitle>Visitas del lead</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						{appointments.length === 0 ? (
							<p className="text-muted-foreground">Todavía no hay visitas cargadas para este lead.</p>
						) : (
							appointments.map((appointment) => (
								<div key={appointment.id} className="rounded-lg border border-border px-4 py-3">
									<div className="flex items-center justify-between gap-3">
										<p className="font-medium">{formatDateTime(appointment.scheduled_at)}</p>
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
									</div>
									<p className="mt-1 text-muted-foreground">
										{appointment.property?.title ?? "Sin propiedad"} ·{" "}
										{appointment.advisor?.full_name ?? appointment.advisor?.email ?? "Sin asesor"}
									</p>
								</div>
							))
						)}
						<Link className="text-teal-700 hover:underline" href="/dashboard/appointments">
							Ir a la agenda completa
						</Link>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Historial de pipeline</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-sm">
					{stageHistory.length === 0 ? (
						<p className="text-muted-foreground">Todavía no hay cambios de etapa registrados.</p>
					) : (
						stageHistory.map((entry) => {
							const historyStage = stages.find((stageOption) => stageOption.id === entry.stage_id);

							return (
								<div key={entry.id} className="rounded-lg border border-border px-4 py-3">
									<p className="font-medium">{historyStage?.name ?? "Etapa desconocida"}</p>
									<p className="text-muted-foreground">{formatDateTime(entry.changed_at)}</p>
									{entry.notes ? <p className="mt-1">{entry.notes}</p> : null}
								</div>
							);
						})
					)}
				</CardContent>
			</Card>
		</>
	);
}
