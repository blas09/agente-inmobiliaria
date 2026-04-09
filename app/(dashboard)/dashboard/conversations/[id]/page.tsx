import Link from "next/link";

import { AppointmentForm } from "@/features/appointments/appointment-form";
import { createAppointmentAction } from "@/features/appointments/actions";
import { getAppointmentRules, summarizeAppointmentRules } from "@/features/appointments/rules";
import { ConversationRoutingForm } from "@/features/conversations/conversation-routing-form";
import {
	sendConversationReplyAction,
	updateConversationLinksAction,
	updateConversationRoutingAction,
} from "@/features/conversations/actions";
import { ConversationLinkingForm } from "@/features/conversations/conversation-linking-form";
import { ManualReplyForm } from "@/features/conversations/manual-reply-form";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getLeadAppointments } from "@/server/queries/appointments";
import { getConversationDetail } from "@/server/queries/conversations";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { listLeads } from "@/server/queries/leads";
import { listAvailablePropertiesForSelection } from "@/server/queries/properties";
import { formatDateTime } from "@/lib/utils";

export default async function ConversationDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { activeTenant } = await getActiveTenantContext();
	const appointmentRules = getAppointmentRules(activeTenant.settings);
	const [{ conversation, messages }, advisors, leads, properties] = await Promise.all([
		getConversationDetail(activeTenant.id, id),
		getAssignableTenantUsers(activeTenant.id),
		listLeads(activeTenant.id),
		listAvailablePropertiesForSelection(activeTenant.id),
	]);
	const appointments = conversation.lead_id ? await getLeadAppointments(activeTenant.id, conversation.lead_id) : [];
	const assignedAdvisor = advisors.find((advisor) => advisor.user_id === conversation.assigned_to);

	return (
		<>
			<PageHeader
				title={conversation.contact_display_name ?? "Conversación"}
				description={conversation.contact_identifier ?? "Sin identificador"}
			/>
			<div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
				<Card>
					<CardHeader>
						<CardTitle>Contexto conversacional</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Estado</span>
							<Badge variant={conversation.status === "pending_human" ? "warning" : "outline"}>
								{conversation.status}
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Canal</span>
							<span>{conversation.channels?.display_name ?? "No disponible"}</span>
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
							<span className="text-muted-foreground">IA</span>
							<span>{conversation.ai_enabled ? "Habilitada" : "Deshabilitada"}</span>
						</div>
						{conversation.lead_id ? (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Lead asociado</span>
								<Link className="text-teal-700 hover:underline" href={`/dashboard/leads/${conversation.lead_id}`}>
									Ver lead
								</Link>
							</div>
						) : null}
						{conversation.property_id ? (
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Propiedad asociada</span>
								<Link
									className="text-teal-700 hover:underline"
									href={`/dashboard/properties/${conversation.property_id}`}
								>
									Ver propiedad
								</Link>
							</div>
						) : null}
						<div>
							<p className="text-muted-foreground">Motivo de handoff</p>
							<p className="mt-1">{conversation.handoff_reason ?? "No registrado"}</p>
						</div>
					</CardContent>
				</Card>
				<ConversationRoutingForm
					action={updateConversationRoutingAction.bind(null, conversation.id)}
					advisorOptions={advisors.map((advisor) => ({
						id: advisor.user_id,
						label: advisor.user_profiles?.full_name ?? advisor.user_profiles?.email ?? advisor.user_id,
						role: advisor.role,
					}))}
					initialValues={{
						assigned_to: conversation.assigned_to,
						status: conversation.status,
						handoff_reason: conversation.handoff_reason,
						ai_enabled: conversation.ai_enabled,
					}}
				/>
				<ManualReplyForm action={sendConversationReplyAction.bind(null, conversation.id)} />
				<ConversationLinkingForm
					action={updateConversationLinksAction.bind(null, conversation.id)}
					initialValues={{
						lead_id: conversation.lead_id,
						property_id: conversation.property_id,
					}}
					leadOptions={leads.map((lead) => ({
						id: lead.id,
						label: `${lead.full_name}${lead.phone ? ` · ${lead.phone}` : ""}`,
					}))}
					propertyOptions={properties.map((property) => ({
						id: property.id,
						label: `${property.title}${property.external_ref ? ` · ${property.external_ref}` : ""}`,
					}))}
				/>
				{conversation.lead_id ? (
					<AppointmentForm
						action={createAppointmentAction.bind(null, conversation.lead_id, [
							`/dashboard/conversations/${conversation.id}`,
							`/dashboard/leads/${conversation.lead_id}`,
							"/dashboard/appointments",
						])}
						advisorOptions={advisors.map((advisor) => ({
							id: advisor.user_id,
							label: advisor.user_profiles?.full_name ?? advisor.user_profiles?.email ?? advisor.user_id,
							role: advisor.role,
						}))}
						initialValues={{
							property_id: conversation.property_id,
							advisor_id: conversation.assigned_to,
						}}
						propertyOptions={properties.map((property) => ({
							id: property.id,
							label: `${property.title}${property.external_ref ? ` · ${property.external_ref}` : ""}`,
						}))}
						rulesSummary={summarizeAppointmentRules(appointmentRules)}
						submitLabel="Agendar visita desde conversación"
						timezone={activeTenant.timezone}
						title="Agenda y visita"
					/>
				) : (
					<Card>
						<CardHeader>
							<CardTitle>Agenda y visita</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Primero vinculá la conversación a un lead para poder agendar una visita.
						</CardContent>
					</Card>
				)}
				<Card>
					<CardHeader>
						<CardTitle>Visitas asociadas al lead</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						{appointments.length === 0 ? (
							<p className="text-muted-foreground">Todavía no hay visitas agendadas para este lead.</p>
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
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Timeline de mensajes</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
									message.direction === "outbound"
										? "ml-auto bg-teal-600 text-white"
										: "bg-slate-100 text-slate-900"
								}`}
							>
								<p>{message.content ?? "Mensaje sin contenido renderizable"}</p>
								<p
									className={`mt-2 text-xs ${
										message.direction === "outbound" ? "text-teal-100" : "text-slate-500"
									}`}
								>
									{message.sender_type} · {formatDateTime(message.created_at)} ·{" "}
									{message.message_status}
								</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
