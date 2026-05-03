import Link from "next/link";

import { AppointmentForm } from "@/features/appointments/appointment-form";
import { createAppointmentAction } from "@/features/appointments/actions";
import {
  getAppointmentRules,
  summarizeAppointmentRules,
} from "@/features/appointments/rules";
import { ConversationRoutingForm } from "@/features/conversations/conversation-routing-form";
import {
  sendConversationReplyAction,
  retryConversationMessageAction,
  updateConversationLinksAction,
  updateConversationRoutingAction,
} from "@/features/conversations/actions";
import { ConversationLinkingForm } from "@/features/conversations/conversation-linking-form";
import { ManualReplyForm } from "@/features/conversations/manual-reply-form";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getLeadAppointments } from "@/server/queries/appointments";
import { getConversationDetail } from "@/server/queries/conversations";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { listLeads } from "@/server/queries/leads";
import { listAvailablePropertiesForSelection } from "@/server/queries/properties";
import { listActiveWhatsAppTemplates } from "@/server/queries/whatsapp-templates";
import { formatDateTime } from "@/lib/utils";
import {
  canManageAppointments,
  canOperateConversations,
} from "@/lib/permissions";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canOperate = canOperateConversations(activeMembership.role);
  const canSchedule = canManageAppointments(activeMembership.role);
  const appointmentRules = getAppointmentRules(activeTenant.settings);
  const [{ conversation, messages }, advisors, leads, properties, templates] =
    await Promise.all([
      getConversationDetail(activeTenant.id, id),
      getAssignableTenantUsers(activeTenant.id),
      listLeads(activeTenant.id),
      listAvailablePropertiesForSelection(activeTenant.id),
      listActiveWhatsAppTemplates(activeTenant.id),
    ]);
  const appointments = conversation.lead_id
    ? await getLeadAppointments(activeTenant.id, conversation.lead_id)
    : [];
  const assignedAdvisor = advisors.find(
    (advisor) => advisor.user_id === conversation.assigned_to,
  );

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title={conversation.contact_display_name ?? "Conversación"}
      />
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Estado</p>
            <div className="mt-3">
              <Badge
                variant={
                  conversation.status === "pending_human"
                    ? "lightWarning"
                    : "lightPrimary"
                }
              >
                {conversation.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Canal</p>
            <p className="mt-3 text-lg font-semibold">
              {conversation.channels?.display_name ?? "No disponible"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Asesor</p>
            <p className="mt-3 text-lg font-semibold">
              {assignedAdvisor?.user_profiles?.full_name ??
                assignedAdvisor?.user_profiles?.email ??
                "Sin asignar"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">IA</p>
            <p className="mt-3 text-lg font-semibold">
              {conversation.ai_enabled ? "Habilitada" : "Deshabilitada"}
            </p>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contexto conversacional</CardTitle>
              <CardDescription>
                Estado operativo, vínculos y handoff de esta conversación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="border-border bg-muted grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                    Lead
                  </p>
                  <p className="mt-1 font-medium">
                    {conversation.lead_id ? (
                      <Link
                        className="text-primary hover:underline"
                        href={`/dashboard/leads/${conversation.lead_id}`}
                      >
                        Ver lead asociado
                      </Link>
                    ) : (
                      "Sin lead"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                    Propiedad
                  </p>
                  <p className="mt-1 font-medium">
                    {conversation.property_id ? (
                      <Link
                        className="text-primary hover:underline"
                        href={`/dashboard/properties/${conversation.property_id}`}
                      >
                        Ver propiedad asociada
                      </Link>
                    ) : (
                      "Sin propiedad"
                    )}
                  </p>
                </div>
              </div>
              <div className="border-border bg-lightprimary rounded-xl border p-4">
                <p className="text-muted-foreground">Motivo de handoff</p>
                <p className="mt-1">
                  {conversation.handoff_reason ?? "No registrado"}
                </p>
              </div>
            </CardContent>
          </Card>
          {canOperate ? (
            <ConversationRoutingForm
              action={updateConversationRoutingAction.bind(
                null,
                conversation.id,
              )}
              advisorOptions={advisors.map((advisor) => ({
                id: advisor.user_id,
                label:
                  advisor.user_profiles?.full_name ??
                  advisor.user_profiles?.email ??
                  advisor.user_id,
                role: advisor.role,
              }))}
              initialValues={{
                assigned_to: conversation.assigned_to,
                status: conversation.status,
                handoff_reason: conversation.handoff_reason,
                ai_enabled: conversation.ai_enabled,
              }}
            />
          ) : null}
          {canOperate ? (
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
          ) : null}
          {conversation.lead_id && canSchedule ? (
            <AppointmentForm
              action={createAppointmentAction.bind(null, conversation.lead_id, [
                `/dashboard/conversations/${conversation.id}`,
                `/dashboard/leads/${conversation.lead_id}`,
                "/dashboard/appointments",
              ])}
              advisorOptions={advisors.map((advisor) => ({
                id: advisor.user_id,
                label:
                  advisor.user_profiles?.full_name ??
                  advisor.user_profiles?.email ??
                  advisor.user_id,
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
                <CardDescription>
                  La agenda interna depende de tener un lead asociado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState
                  title={
                    conversation.lead_id
                      ? "Sin permisos para agenda"
                      : "Falta vincular un lead"
                  }
                  description={
                    conversation.lead_id
                      ? "Necesitás un rol operativo para agendar o editar visitas desde la conversación."
                      : "Primero asociá esta conversación a un lead para poder agendar una visita."
                  }
                />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Visitas asociadas al lead</CardTitle>
              <CardDescription>
                Últimas visitas cargadas para el lead vinculado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {appointments.length === 0 ? (
                <EmptyState
                  title="Sin visitas agendadas"
                  description="Cuando el lead pase a visita, la agenda interna y su estado van a quedar visibles acá."
                />
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border-border bg-card rounded-xl border px-4 py-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-medium">
                        {formatDateTime(appointment.scheduled_at)}
                      </p>
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
                    <p className="text-muted-foreground mt-1">
                      {appointment.property?.title ?? "Sin propiedad"} ·{" "}
                      {appointment.advisor?.full_name ??
                        appointment.advisor?.email ??
                        "Sin asesor"}
                    </p>
                  </div>
                ))
              )}
              <Link
                className="text-primary hover:underline"
                href="/dashboard/appointments"
              >
                Ir a la agenda completa
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {canOperate ? (
            <ManualReplyForm
              action={sendConversationReplyAction.bind(null, conversation.id)}
              templates={templates.map((template) => ({
                id: template.id,
                name: template.name,
                language: template.language,
                category: template.category,
                components: template.components,
              }))}
            />
          ) : null}
          <Card>
            <CardHeader>
              <CardTitle>Timeline de mensajes</CardTitle>
              <CardDescription>
                Historial inbound y outbound persistido por canal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm sm:max-w-[85%] ${
                    message.direction === "outbound"
                      ? "bg-primary ml-auto text-white shadow-sm"
                      : "border-border bg-muted text-foreground border"
                  }`}
                >
                  <p>
                    {message.content ?? "Mensaje sin contenido renderizable"}
                  </p>
                  <p
                    className={`mt-2 text-xs ${
                      message.direction === "outbound"
                        ? "text-white/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.sender_type} · {formatDateTime(message.created_at)}{" "}
                    · {message.message_status}
                  </p>
                  {canOperate &&
                  message.direction === "outbound" &&
                  message.message_status === "failed" ? (
                    <div className="mt-3 space-y-3">
                      {message.error_message ? (
                        <p className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-xs text-white">
                          Error: {message.error_message}
                        </p>
                      ) : null}
                      <form
                        action={retryConversationMessageAction}
                        className="flex justify-end"
                      >
                        <input
                          name="message_id"
                          type="hidden"
                          value={message.id}
                        />
                        <Button size="sm" variant="outline" type="submit">
                          Reintentar
                        </Button>
                      </form>
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
