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

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title={lead.full_name}
        action={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="text-primary inline-flex items-center text-sm font-medium hover:underline"
              href={`/dashboard/leads/${lead.id}/edit`}
            >
              Editar
            </Link>
            <form action={deleteAction}>
              <Button type="submit" variant="destructive" shape="pill">
                Eliminar
              </Button>
            </form>
          </div>
        }
      />
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Estado comercial</p>
            <div className="mt-3 flex items-center gap-3">
              <Badge
                variant={
                  lead.qualification_status === "qualified"
                    ? "lightSuccess"
                    : "lightPrimary"
                }
              >
                {lead.qualification_status}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Score {lead.score ?? "-"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">Etapa</p>
            <p className="mt-3 text-lg font-semibold">
              {stage?.name ?? "Sin etapa"}
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
            <p className="text-muted-foreground text-sm">Creado</p>
            <p className="mt-3 text-lg font-semibold">
              {formatDateTime(lead.created_at)}
            </p>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Perfil comercial</CardTitle>
            <CardDescription>
              Contexto de negocio y datos principales del lead.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Interés</span>
              <span>{lead.interest_type ?? "Sin definir"}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Score</span>
              <span>{lead.score ?? "-"}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Asesor</span>
              <span>
                {assignedAdvisor?.user_profiles?.full_name ??
                  assignedAdvisor?.user_profiles?.email ??
                  "Sin asignar"}
              </span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Etapa</span>
              <span>{stage?.name ?? "Sin etapa"}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Creado</span>
              <span>{formatDateTime(lead.created_at)}</span>
            </div>
            <div className="border-border bg-muted grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                  Fuente
                </p>
                <p className="mt-1 font-medium">
                  {lead.source ?? "Sin fuente"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  Contacto
                </p>
                <p className="mt-1 font-medium">
                  {lead.phone ?? lead.email ?? "Sin contacto"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  Presupuesto
                </p>
                <p className="mt-1 font-medium">
                  {lead.budget_min || lead.budget_max
                    ? `${lead.budget_min ?? "-"} / ${lead.budget_max ?? "-"}`
                    : "Sin definir"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                  Zona objetivo
                </p>
                <p className="mt-1 font-medium">
                  {lead.desired_neighborhood ??
                    lead.desired_city ??
                    "Sin preferencia cargada"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contexto y notas</CardTitle>
            <CardDescription>
              Observaciones internas y necesidad de handoff.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-foreground/80 leading-7">
              {lead.notes ?? "Sin notas cargadas."}
            </p>
            <div className="border-border bg-lightprimary rounded-xl border p-4">
              <p className="font-medium">Derivación humana</p>
              <p className="text-muted-foreground mt-1">
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
        <Card>
          <CardHeader>
            <CardTitle>Conversaciones asociadas</CardTitle>
            <CardDescription>
              Historial de contacto conectado a este lead.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
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
                    {conversation.status} ·{" "}
                    {formatDateTime(conversation.last_message_at)}
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
        <Card>
          <CardHeader>
            <CardTitle>Visitas del lead</CardTitle>
            <CardDescription>
              Agenda interna vinculada a este lead.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
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
      <Card>
        <CardHeader>
          <CardTitle>Historial de pipeline</CardTitle>
          <CardDescription>
            Registro de cambios de etapa comerciales.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-3">
          {stageHistory.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3">
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
                  {entry.notes ? <p className="mt-1">{entry.notes}</p> : null}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
