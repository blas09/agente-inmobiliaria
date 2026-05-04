import Link from "next/link";

import { AppointmentForm } from "@/features/appointments/appointment-form";
import { createAppointmentAction } from "@/features/appointments/actions";
import {
  getAppointmentRules,
  summarizeAppointmentRules,
} from "@/features/appointments/rules";
import {
  deleteLeadAction,
  updateLeadRoutingAction,
} from "@/features/leads/actions";
import { LeadRoutingForm } from "@/features/leads/lead-routing-form";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  canDeleteLeads,
  canManageAppointments,
  canManageLeads,
} from "@/lib/permissions";
import { formatDateTime } from "@/lib/utils";
import {
  getConversationStatusLabel,
  getLeadInterestTypeLabel,
  getLeadQualificationStatusLabel,
  getLeadSourceLabel,
} from "@/lib/ui-labels";
import {
  getAppointmentStatusLabel,
  getAppointmentStatusTone,
} from "@/features/appointments/status";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const appointmentRules = getAppointmentRules(activeTenant.settings);
  const canEditLead = canManageLeads(activeMembership.role);
  const canDeleteLead = canDeleteLeads(activeMembership.role);
  const canScheduleAppointment = canManageAppointments(activeMembership.role);
  const [
    lead,
    stages,
    stageHistory,
    advisors,
    conversations,
    appointments,
    properties,
  ] = await Promise.all([
    getLeadById(activeTenant.id, id),
    getPipelineStages(activeTenant.id),
    getLeadStageHistory(activeTenant.id, id),
    getAssignableTenantUsers(activeTenant.id),
    getLeadConversations(activeTenant.id, id),
    getLeadAppointments(activeTenant.id, id),
    listAvailablePropertiesForSelection(activeTenant.id),
  ]);
  const stage = stages.find((item) => item.id === lead.pipeline_stage_id);
  const assignedAdvisor = advisors.find(
    (advisor) => advisor.user_id === lead.assigned_to,
  );
  const deleteAction = deleteLeadAction.bind(null, lead.id);
  const appointmentAction = createAppointmentAction.bind(null, lead.id, [
    `/dashboard/leads/${lead.id}`,
    "/dashboard/appointments",
  ]);
  const advisorLabel =
    assignedAdvisor?.user_profiles?.full_name ??
    assignedAdvisor?.user_profiles?.email ??
    "Sin asignar";
  const contactLabel = lead.phone ?? lead.email ?? "Sin contacto";
  const budgetLabel =
    lead.budget_min || lead.budget_max
      ? `${lead.budget_min ?? "-"} / ${lead.budget_max ?? "-"}`
      : "Sin definir";
  const zoneLabel =
    lead.desired_neighborhood ?? lead.desired_city ?? "Sin preferencia cargada";
  const overviewItems = [
    {
      label: "Etapa",
      value: stage?.name ?? "Sin etapa",
    },
    {
      label: "Asesor",
      value: advisorLabel,
    },
    {
      label: "Contacto",
      value: contactLabel,
    },
    {
      label: "Fuente",
      value: getLeadSourceLabel(lead.source),
    },
    {
      label: "Presupuesto",
      value: budgetLabel,
    },
    {
      label: "Zona objetivo",
      value: zoneLabel,
    },
    {
      label: "Interés",
      value: getLeadInterestTypeLabel(lead.interest_type),
    },
    {
      label: "Creado",
      value: formatDateTime(lead.created_at),
    },
  ];

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title={lead.full_name}
        description="Perfil comercial para calificar, asignar, vincular conversaciones y agendar visitas."
        action={
          canEditLead || canDeleteLead ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {canEditLead ? (
                <Link
                  className={buttonVariants({ variant: "lightprimary" })}
                  href={`/dashboard/leads/${lead.id}/edit`}
                >
                  Editar
                </Link>
              ) : null}
              {canDeleteLead ? (
                <form action={deleteAction}>
                  <ConfirmSubmitButton confirmMessage="¿Eliminar este lead? Esta acción no se puede deshacer.">
                    Eliminar
                  </ConfirmSubmitButton>
                </form>
              ) : null}
            </div>
          ) : null
        }
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Resumen comercial</CardTitle>
              <CardDescription>
                Datos clave para decidir la próxima acción sin recorrer todo el
                historial.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant={
                  lead.qualification_status === "qualified"
                    ? "lightSuccess"
                    : "lightPrimary"
                }
              >
                {getLeadQualificationStatusLabel(lead.qualification_status)}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Score {lead.score ?? "-"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {overviewItems.map((item) => (
            <div
              className="border-border bg-card rounded-xl border px-4 py-3 text-sm"
              key={item.label}
            >
              <p className="text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-semibold">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {canEditLead ? (
          <LeadRoutingForm
            action={updateLeadRoutingAction.bind(null, lead.id)}
            advisorOptions={advisors.map((advisor) => ({
              id: advisor.user_id,
              label:
                advisor.user_profiles?.full_name ??
                advisor.user_profiles?.email ??
                advisor.user_id,
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
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle>Contexto operativo</CardTitle>
            <CardDescription>
              Notas internas, derivación y conversaciones vinculadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="border-border bg-lightprimary rounded-xl border p-4">
              <p className="font-medium">Derivación humana</p>
              <p className="text-muted-foreground mt-1">
                {lead.is_human_handoff_required ? "Sí" : "No"}
              </p>
            </div>
            <details className="border-border rounded-xl border p-4" open>
              <summary className="cursor-pointer text-sm font-semibold">
                Notas internas
              </summary>
              <p className="text-foreground/80 mt-3 leading-7">
                {lead.notes ?? "Sin notas cargadas."}
              </p>
            </details>
            <details className="border-border rounded-xl border p-4">
              <summary className="cursor-pointer text-sm font-semibold">
                Conversaciones asociadas ({conversations.length})
              </summary>
              <div className="mt-3 space-y-3">
                {conversations.length === 0 ? (
                  <EmptyState
                    title="Sin conversaciones vinculadas"
                    description="Cuando el lead entre por WhatsApp o se lo vincule manualmente, va a aparecer acá."
                    actionHref="/dashboard/conversations"
                    actionLabel="Ver conversaciones"
                  />
                ) : (
                  conversations.map((conversation) => (
                    <Link
                      key={conversation.id}
                      className="border-border bg-card hover:border-primary/25 block rounded-xl border px-4 py-3 transition hover:shadow-sm"
                      href={`/dashboard/conversations/${conversation.id}`}
                    >
                      <p className="font-medium">
                        {conversation.contact_display_name ??
                          "Conversación sin nombre"}
                      </p>
                      <p className="text-muted-foreground">
                        {getConversationStatusLabel(conversation.status)} ·{" "}
                        {formatDateTime(conversation.last_message_at)}
                      </p>
                      <p className="text-muted-foreground mt-1">
                        Propiedad:{" "}
                        {conversation.properties ? (
                          <span className="text-foreground">
                            {conversation.properties.title}
                            {conversation.properties.external_ref
                              ? ` · ${conversation.properties.external_ref}`
                              : ""}
                          </span>
                        ) : conversation.property_id ? (
                          <span className="text-foreground">
                            Propiedad no disponible
                          </span>
                        ) : (
                          <span className="text-foreground">Sin propiedad</span>
                        )}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {canScheduleAppointment ? (
          <AppointmentForm
            action={appointmentAction}
            advisorOptions={advisors.map((advisor) => ({
              id: advisor.user_id,
              label:
                advisor.user_profiles?.full_name ??
                advisor.user_profiles?.email ??
                advisor.user_id,
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
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle>Seguimiento</CardTitle>
            <CardDescription>
              Visitas e historial comercial disponibles sin ocupar la vista
              principal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <details className="border-border rounded-xl border p-4" open>
              <summary className="cursor-pointer text-sm font-semibold">
                Visitas del lead ({appointments.length})
              </summary>
              <div className="mt-3 space-y-3">
                {appointments.length === 0 ? (
                  <EmptyState
                    title="Sin visitas todavía"
                    description="Podés agendar una visita interna desde este lead usando las reglas activas del tenant."
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
                          variant={getAppointmentStatusTone(appointment.status)}
                        >
                          {getAppointmentStatusLabel(appointment.status)}
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
                  className="text-primary inline-flex hover:underline"
                  href="/dashboard/appointments"
                >
                  Ir a la agenda completa
                </Link>
              </div>
            </details>
            <details className="border-border rounded-xl border p-4">
              <summary className="cursor-pointer text-sm font-semibold">
                Historial de pipeline ({stageHistory.length})
              </summary>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {stageHistory.length === 0 ? (
                  <div className="md:col-span-2">
                    <EmptyState
                      title="Sin cambios de etapa"
                      description="El historial va a aparecer cuando el lead avance o retroceda dentro del pipeline comercial."
                    />
                  </div>
                ) : (
                  stageHistory.map((entry) => {
                    const historyStage = stages.find(
                      (stageOption) => stageOption.id === entry.stage_id,
                    );

                    return (
                      <div
                        key={entry.id}
                        className="border-border bg-card rounded-xl border px-4 py-3"
                      >
                        <p className="font-medium">
                          {historyStage?.name ?? "Etapa desconocida"}
                        </p>
                        <p className="text-muted-foreground">
                          {formatDateTime(entry.changed_at)}
                        </p>
                        {entry.notes ? (
                          <p className="mt-1">{entry.notes}</p>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
