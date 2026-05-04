import Link from "next/link";
import {
  CalendarCheck2,
  MessageCircleMore,
  Building2,
  Users,
  Shield,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAppointmentStatusLabel,
  getAppointmentStatusTone,
} from "@/features/appointments/status";
import { getDashboardSummary } from "@/server/queries/dashboard";
import { getAppContext } from "@/server/auth/tenant-context";
import { getPlatformSummary } from "@/server/queries/tenants";
import { formatCompactNumber, formatDateTime } from "@/lib/utils";
import {
  getConversationStatusLabel,
  getLeadQualificationStatusLabel,
  getLeadSourceLabel,
} from "@/lib/ui-labels";

const metricCards = [
  {
    key: "activeProperties",
    label: "Propiedades activas",
    icon: Building2,
    tone: "primary",
  },
  {
    key: "leads",
    label: "Leads",
    icon: Users,
    tone: "secondary",
  },
  {
    key: "openConversations",
    label: "Conversaciones abiertas",
    icon: MessageCircleMore,
    tone: "success",
  },
] as const;

const advisorDashboardTabs = [
  { id: "priorities", label: "Prioridades" },
  { id: "agenda", label: "Agenda" },
  { id: "signals", label: "Señales" },
] as const;

const adminDashboardTabs = [
  { id: "operation", label: "Operación" },
  { id: "reports", label: "Reportes" },
  { id: "activity", label: "Actividad" },
  { id: "tenant", label: "Tenant" },
] as const;

type AdvisorDashboardTab = (typeof advisorDashboardTabs)[number]["id"];
type AdminDashboardTab = (typeof adminDashboardTabs)[number]["id"];

function resolveTab<TTab extends string>(
  tab: string | string[] | undefined,
  tabs: readonly { id: TTab; label: string }[],
  fallback: TTab,
) {
  const value = Array.isArray(tab) ? tab[0] : tab;
  return tabs.some((item) => item.id === value) ? (value as TTab) : fallback;
}

function DashboardTabs<TTab extends string>({
  activeTab,
  tabs,
}: {
  activeTab: TTab;
  tabs: readonly { id: TTab; label: string }[];
}) {
  return (
    <nav className="border-border flex gap-2 overflow-x-auto border-b">
      {tabs.map((item) => (
        <Link
          className={
            activeTab === item.id
              ? "border-primary text-primary border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap"
              : "text-muted-foreground hover:text-foreground px-4 py-3 text-sm font-medium whitespace-nowrap"
          }
          href={`/dashboard?tab=${item.id}`}
          key={item.id}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function formatResponseMinutes(minutes: number | null) {
  if (minutes === null) {
    return "Sin datos";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours} h ${remainingMinutes} min`
    : `${hours} h`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const params = await searchParams;
  const context = await getAppContext();

  if (!context.activeTenant) {
    const summary = await getPlatformSummary();

    return (
      <div className="space-y-6">
        <ProfileWelcome
          title="Panel de plataforma"
          description="Vista global para administración de tenants y gobierno del SaaS."
        />
        <DashboardTopCards
          items={[
            {
              key: "tenants",
              label: "Tenants",
              value: formatCompactNumber(summary.totalTenants),
              icon: Building2,
              tone: "primary",
            },
            {
              key: "active-tenants",
              label: "Tenants activos",
              value: formatCompactNumber(summary.activeTenants),
              icon: Users,
              tone: "success",
            },
            {
              key: "memberships",
              label: "Membresías activas",
              value: formatCompactNumber(summary.activeMemberships),
              icon: Shield,
              tone: "secondary",
            },
          ]}
        />
        <EmptyState
          title="Sin tenant activo"
          description="Como platform admin, podés crear tenants o sumarte a uno existente desde la sección de tenants."
          actionHref="/dashboard/platform/tenants"
          actionLabel="Ver tenants"
        />
      </div>
    );
  }

  const { activeTenant } = context;
  const activeRole = context.activeMembership?.role;
  const isAdvisorDashboard = activeRole === "advisor";
  const summary = await getDashboardSummary(
    activeTenant.id,
    isAdvisorDashboard ? { advisorId: context.user.id } : undefined,
  );

  if (isAdvisorDashboard) {
    const activeAdvisorTab = resolveTab<AdvisorDashboardTab>(
      params.tab,
      advisorDashboardTabs,
      "priorities",
    );
    const pendingConversations = summary.recentConversations.filter(
      (conversation) => conversation.status === "pending_human",
    );

    return (
      <div className="space-y-6">
        <ProfileWelcome
          title="Mi operación"
          description="Prioridades del día: leads asignados, conversaciones pendientes y próximas visitas."
        />
        <DashboardTopCards
          items={[
            {
              key: "leads",
              label: "Leads asignados",
              value: formatCompactNumber(summary.metrics.leads),
              icon: Users,
              tone: "primary",
            },
            {
              key: "pending-conversations",
              label: "Conversaciones abiertas",
              value: formatCompactNumber(summary.metrics.openConversations),
              icon: MessageCircleMore,
              tone: "warning",
            },
            {
              key: "upcoming-visits",
              label: "Próximas visitas",
              value: formatCompactNumber(summary.upcomingAppointments.length),
              icon: CalendarCheck2,
              tone: "success",
            },
          ]}
        />
        <DashboardTabs
          activeTab={activeAdvisorTab}
          tabs={advisorDashboardTabs}
        />
        {activeAdvisorTab === "priorities" ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <CardBox className="h-full w-full">
                <CardHeader>
                  <CardTitle>Próximas acciones</CardTitle>
                  <CardDescription>
                    Conversaciones y leads recientes para retomar primero.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 xl:grid-cols-2">
                  <section className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">
                        Conversaciones pendientes
                      </p>
                      <Badge variant="lightWarning">
                        {pendingConversations.length}
                      </Badge>
                    </div>
                    {pendingConversations.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No hay conversaciones recientes pendientes de atención.
                      </p>
                    ) : (
                      <div className="divide-border divide-y">
                        {pendingConversations.map((conversation) => (
                          <Link
                            key={conversation.id}
                            href={`/dashboard/conversations/${conversation.id}`}
                            className="hover:bg-lightprimary/20 block py-3 transition"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium">
                                {conversation.contact_display_name ??
                                  "Contacto sin nombre"}
                              </p>
                              <Badge variant="lightWarning">
                                {getConversationStatusLabel(
                                  conversation.status,
                                )}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {formatDateTime(conversation.last_message_at)}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>
                  <section className="space-y-3">
                    <p className="text-sm font-semibold">
                      Leads asignados recientes
                    </p>
                    {summary.recentLeads.length === 0 ? (
                      <EmptyState
                        title="Sin leads recientes"
                        description="Cuando tengas leads nuevos o actualizados, van a aparecer acá."
                        actionHref="/dashboard/leads"
                        actionLabel="Ver leads"
                      />
                    ) : (
                      <div className="divide-border divide-y">
                        {summary.recentLeads.map((lead) => (
                          <Link
                            key={lead.id}
                            href={`/dashboard/leads/${lead.id}`}
                            className="hover:bg-lightprimary/20 block py-3 transition"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium">{lead.full_name}</p>
                              <Badge variant="gray">
                                {getLeadQualificationStatusLabel(
                                  lead.qualification_status,
                                )}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {getLeadSourceLabel(lead.source)} ·{" "}
                              {formatDateTime(lead.created_at)}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>
                </CardContent>
              </CardBox>
            </div>
          </div>
        ) : null}
        {activeAdvisorTab === "agenda" ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <CardBox className="h-full w-full">
                <CardHeader>
                  <CardTitle>Agenda cercana</CardTitle>
                  <CardDescription>
                    Visitas próximas para preparar o confirmar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {summary.upcomingAppointments.length === 0 ? (
                    <EmptyState
                      title="Sin visitas próximas"
                      description="Las visitas agendadas o confirmadas van a aparecer acá."
                      actionHref="/dashboard/appointments"
                      actionLabel="Ver agenda"
                    />
                  ) : (
                    <div className="divide-border divide-y">
                      {summary.upcomingAppointments.map((appointment) => (
                        <Link
                          key={appointment.id}
                          href="/dashboard/appointments"
                          className="hover:bg-lightprimary/20 block py-3 transition"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium">
                              {formatDateTime(appointment.scheduled_at)}
                            </p>
                            <Badge
                              variant={getAppointmentStatusTone(
                                appointment.status,
                              )}
                            >
                              {getAppointmentStatusLabel(appointment.status)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {appointment.leads?.full_name ?? "Lead sin nombre"}{" "}
                            · {appointment.properties?.title ?? "Sin propiedad"}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </CardBox>
            </div>
          </div>
        ) : null}
        {activeAdvisorTab === "signals" ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <CardBox>
                <CardHeader>
                  <CardTitle>Señales rápidas</CardTitle>
                  <CardDescription>
                    Señales comerciales útiles sin vista administrativa
                    completa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-border grid text-sm md:grid-cols-3 md:divide-x">
                    <div className="py-3 md:px-4 md:first:pl-0">
                      <span className="text-muted-foreground">
                        Primera respuesta
                      </span>
                      <p className="mt-1 font-semibold">
                        {formatResponseMinutes(
                          summary.firstResponseReport
                            .averageFirstResponseMinutes,
                        )}
                      </p>
                    </div>
                    <div className="py-3 md:px-4">
                      <span className="text-muted-foreground">Respondidas</span>
                      <p className="mt-1 font-semibold">
                        {summary.firstResponseReport.respondedConversations}
                      </p>
                    </div>
                    <div className="py-3 md:px-4 md:last:pr-0">
                      <span className="text-muted-foreground">Pendientes</span>
                      <p className="mt-1 font-semibold">
                        {
                          summary.firstResponseReport
                            .pendingResponseConversations
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CardBox>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const activeAdminTab = resolveTab<AdminDashboardTab>(
    params.tab,
    adminDashboardTabs,
    "operation",
  );

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title={`Inmobiliaria ${activeTenant.name}`}
        description="Seguimiento del flujo comercial: propiedades, leads, conversaciones, visitas y próximos seguimientos."
      />
      <DashboardTopCards
        items={metricCards.map((metric) => ({
          key: metric.key,
          label: metric.label,
          value: formatCompactNumber(summary.metrics[metric.key]),
          icon: metric.icon,
          tone: metric.tone,
        }))}
      />
      <DashboardTabs activeTab={activeAdminTab} tabs={adminDashboardTabs} />
      <div className="grid grid-cols-12 gap-6">
        {activeAdminTab === "operation" ? (
          <div className="col-span-12 xl:col-span-4">
            <CardBox className="h-full w-full">
              <CardHeader>
                <CardTitle>Leads por fuente</CardTitle>
                <CardDescription>
                  Lectura rápida del origen comercial del tenant.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary.leadsBySource.length === 0 ? (
                  <EmptyState
                    title="Sin leads todavía"
                    description="Cuando entren consultas por WhatsApp, email o carga manual, aparecerán acá."
                    actionHref="/dashboard/leads/new"
                    actionLabel="Crear lead"
                  />
                ) : (
                  <div className="divide-border divide-y">
                    {summary.leadsBySource.map((item) => (
                      <div
                        key={item.source}
                        className="flex items-center justify-between gap-3 py-3 text-sm"
                      >
                        <p className="font-medium">
                          {getLeadSourceLabel(item.source)}
                        </p>
                        <Badge variant="gray">{item.total}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </CardBox>
          </div>
        ) : null}
        {activeAdminTab === "tenant" ? (
          <div className="col-span-12">
            <CardBox className="h-full w-full">
              <CardHeader>
                <CardTitle>Contexto del tenant</CardTitle>
                <CardDescription>
                  Parámetros centrales que condicionan pricing, idioma y
                  operación.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-border grid gap-0 text-sm sm:grid-cols-2 sm:divide-x">
                  <div className="divide-border divide-y sm:pr-5">
                    <div className="py-3">
                      <span className="text-muted-foreground">Slug</span>
                      <p className="mt-1 font-semibold">{activeTenant.slug}</p>
                    </div>
                    <div className="py-3">
                      <span className="text-muted-foreground">
                        Moneda principal
                      </span>
                      <p className="mt-1 font-semibold">
                        {activeTenant.primary_currency}
                      </p>
                    </div>
                  </div>
                  <div className="divide-border divide-y sm:pl-5">
                    <div className="py-3">
                      <span className="text-muted-foreground">Timezone</span>
                      <p className="mt-1 font-semibold">
                        {activeTenant.timezone}
                      </p>
                    </div>
                    <div className="py-3">
                      <span className="text-muted-foreground">Locale</span>
                      <p className="mt-1 font-semibold">
                        {activeTenant.locale}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CardBox>
          </div>
        ) : null}
        {activeAdminTab === "operation" ? (
          <div className="col-span-12 xl:col-span-4">
            <CardBox className="h-full w-full">
              <CardHeader>
                <CardTitle>Pipeline comercial</CardTitle>
                <CardDescription>
                  Distribución actual de leads por etapa operativa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary.pipelineReport.length === 0 ? (
                  <EmptyState
                    title="Sin etapas configuradas"
                    description="Las etapas del pipeline van a aparecer cuando el tenant tenga configuración comercial."
                    actionHref="/dashboard/settings"
                    actionLabel="Ver settings"
                  />
                ) : (
                  <div className="divide-border divide-y">
                    {summary.pipelineReport.map((stage) => (
                      <div
                        className="flex items-center justify-between gap-3 py-3 text-sm"
                        key={stage.stageId}
                      >
                        <p className="font-medium">{stage.label}</p>
                        <Badge
                          variant={stage.total > 0 ? "lightPrimary" : "gray"}
                        >
                          {stage.total}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </CardBox>
          </div>
        ) : null}
        {activeAdminTab === "reports" ? (
          <div className="col-span-12 xl:col-span-6">
            <CardBox className="h-full w-full">
              <CardHeader>
                <CardTitle>Leads por asesor</CardTitle>
                <CardDescription>
                  Carga comercial asignada a cada responsable.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary.advisorReport.length === 0 ? (
                  <EmptyState
                    title="Sin leads asignados"
                    description="Cuando se asignen leads a asesores, la distribución va a quedar visible acá."
                    actionHref="/dashboard/leads"
                    actionLabel="Ver leads"
                  />
                ) : (
                  <div className="divide-border divide-y">
                    {summary.advisorReport.map((advisor) => (
                      <div
                        className="flex items-center justify-between gap-3 py-3 text-sm"
                        key={advisor.advisorId}
                      >
                        <p className="font-medium">{advisor.label}</p>
                        <Badge variant="lightSecondary">{advisor.total}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </CardBox>
          </div>
        ) : null}
        {activeAdminTab === "operation" ? (
          <div className="col-span-12 xl:col-span-4">
            <CardBox className="h-full w-full">
              <CardHeader>
                <CardTitle>Resultado de visitas</CardTitle>
                <CardDescription>
                  Estado actual de la agenda interna del tenant.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-border divide-y">
                  {summary.appointmentOutcomeReport.map((item) => (
                    <div
                      className="flex items-center justify-between gap-3 py-3 text-sm"
                      key={item.status}
                    >
                      <p className="font-medium">
                        {getAppointmentStatusLabel(item.status)}
                      </p>
                      <Badge variant={getAppointmentStatusTone(item.status)}>
                        {item.total}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CardBox>
          </div>
        ) : null}
        {activeAdminTab === "reports" ? (
          <div className="col-span-12 xl:col-span-6">
            <CardBox className="h-full w-full">
              <CardHeader>
                <CardTitle>Primera respuesta</CardTitle>
                <CardDescription>
                  Tiempo desde primer mensaje entrante hasta primera respuesta
                  saliente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-border grid text-sm sm:grid-cols-3 sm:divide-x">
                  <div className="py-3 sm:px-4 sm:first:pl-0">
                    <span className="text-muted-foreground">Promedio</span>
                    <p className="mt-1 font-semibold">
                      {formatResponseMinutes(
                        summary.firstResponseReport.averageFirstResponseMinutes,
                      )}
                    </p>
                  </div>
                  <div className="py-3 sm:px-4">
                    <span className="text-muted-foreground">Respondidas</span>
                    <p className="mt-1 font-semibold">
                      {summary.firstResponseReport.respondedConversations}
                    </p>
                  </div>
                  <div className="py-3 sm:px-4 sm:last:pr-0">
                    <span className="text-muted-foreground">Pendientes</span>
                    <p className="mt-1 font-semibold">
                      {summary.firstResponseReport.pendingResponseConversations}
                    </p>
                  </div>
                </div>
              </CardContent>
            </CardBox>
          </div>
        ) : null}
        {activeAdminTab === "activity" ? (
          <div className="col-span-12 xl:col-span-6">
            <CardBox className="h-full w-full">
              <CardHeader>
                <CardTitle>Últimos leads</CardTitle>
                <CardDescription>
                  Actividad comercial reciente del tenant.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary.recentLeads.length === 0 ? (
                  <EmptyState
                    title="Sin actividad reciente"
                    description="Los leads creados o ingresados por canales van a aparecer en esta lista."
                    actionHref="/dashboard/leads"
                    actionLabel="Ver leads"
                  />
                ) : (
                  <div className="divide-border divide-y">
                    {summary.recentLeads.map((lead) => (
                      <Link
                        key={lead.id}
                        href={`/dashboard/leads/${lead.id}`}
                        className="hover:bg-lightprimary/20 block py-3 transition"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{lead.full_name}</p>
                          <Badge variant="gray">
                            {getLeadQualificationStatusLabel(
                              lead.qualification_status,
                            )}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {getLeadSourceLabel(lead.source)} ·{" "}
                          {formatDateTime(lead.created_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </CardBox>
          </div>
        ) : null}
        {activeAdminTab === "activity" ? (
          <div className="col-span-12 xl:col-span-6">
            <CardBox className="h-full w-full">
              <CardHeader>
                <CardTitle>Conversaciones recientes</CardTitle>
                <CardDescription>
                  Últimos contactos entrando por canales conectados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary.recentConversations.length === 0 ? (
                  <EmptyState
                    title="Sin conversaciones recientes"
                    description="Los contactos entrantes por canales conectados van a aparecer acá."
                    actionHref="/dashboard/conversations"
                    actionLabel="Ver conversaciones"
                  />
                ) : (
                  <div className="divide-border divide-y">
                    {summary.recentConversations.map((conversation) => (
                      <Link
                        key={conversation.id}
                        href={`/dashboard/conversations/${conversation.id}`}
                        className="hover:bg-lightprimary/20 block py-3 transition"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">
                            {conversation.contact_display_name ??
                              "Contacto sin nombre"}
                          </p>
                          <Badge
                            variant={
                              conversation.status === "pending_human"
                                ? "lightWarning"
                                : "gray"
                            }
                          >
                            {getConversationStatusLabel(conversation.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {formatDateTime(conversation.last_message_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </CardBox>
          </div>
        ) : null}
      </div>
    </div>
  );
}
