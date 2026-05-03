import Link from "next/link";
import { MessageCircleMore, Building2, Users, Shield } from "lucide-react";

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

export default async function DashboardPage() {
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
  const summary = await getDashboardSummary(activeTenant.id);

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title={`Inmobiliaria ${activeTenant.name}`}
        description="Base operativa del tenant activo: propiedades, leads, conversaciones y canales."
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
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <CardBox className="h-full w-full">
            <CardHeader>
              <CardTitle>Leads por fuente</CardTitle>
              <CardDescription>
                Lectura rápida del origen comercial del tenant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.leadsBySource.length === 0 ? (
                <EmptyState
                  title="Sin leads todavía"
                  description="Cuando entren consultas por WhatsApp, email o carga manual, aparecerán acá."
                  actionHref="/dashboard/leads/new"
                  actionLabel="Crear lead"
                />
              ) : (
                summary.leadsBySource.map((item) => (
                  <div
                    key={item.source}
                    className="border-border flex items-center justify-between rounded-xl border px-4 py-3"
                  >
                    <p className="text-sm font-medium capitalize">
                      {item.source}
                    </p>
                    <Badge variant="gray">{item.total}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </CardBox>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <CardBox className="h-full w-full">
            <CardHeader>
              <CardTitle>Contexto del tenant</CardTitle>
              <CardDescription>
                Parámetros centrales que condicionan pricing, idioma y
                operación.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="border-border rounded-xl border px-4 py-3">
                <span className="text-muted-foreground">Slug</span>
                <p className="mt-1 font-semibold">{activeTenant.slug}</p>
              </div>
              <div className="border-border rounded-xl border px-4 py-3">
                <span className="text-muted-foreground">Moneda principal</span>
                <p className="mt-1 font-semibold">
                  {activeTenant.primary_currency}
                </p>
              </div>
              <div className="border-border rounded-xl border px-4 py-3">
                <span className="text-muted-foreground">Timezone</span>
                <p className="mt-1 font-semibold">{activeTenant.timezone}</p>
              </div>
              <div className="border-border rounded-xl border px-4 py-3">
                <span className="text-muted-foreground">Locale</span>
                <p className="mt-1 font-semibold">{activeTenant.locale}</p>
              </div>
            </CardContent>
          </CardBox>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <CardBox className="h-full w-full">
            <CardHeader>
              <CardTitle>Pipeline comercial</CardTitle>
              <CardDescription>
                Distribución actual de leads por etapa operativa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.pipelineReport.length === 0 ? (
                <EmptyState
                  title="Sin etapas configuradas"
                  description="Las etapas del pipeline van a aparecer cuando el tenant tenga configuración comercial."
                  actionHref="/dashboard/settings"
                  actionLabel="Ver settings"
                />
              ) : (
                summary.pipelineReport.map((stage) => (
                  <div
                    className="border-border flex items-center justify-between rounded-xl border px-4 py-3"
                    key={stage.stageId}
                  >
                    <p className="text-sm font-medium">{stage.label}</p>
                    <Badge variant={stage.total > 0 ? "lightPrimary" : "gray"}>
                      {stage.total}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </CardBox>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <CardBox className="h-full w-full">
            <CardHeader>
              <CardTitle>Leads por asesor</CardTitle>
              <CardDescription>
                Carga comercial asignada a cada responsable.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.advisorReport.length === 0 ? (
                <EmptyState
                  title="Sin leads asignados"
                  description="Cuando se asignen leads a asesores, la distribución va a quedar visible acá."
                  actionHref="/dashboard/leads"
                  actionLabel="Ver leads"
                />
              ) : (
                summary.advisorReport.map((advisor) => (
                  <div
                    className="border-border flex items-center justify-between rounded-xl border px-4 py-3"
                    key={advisor.advisorId}
                  >
                    <p className="text-sm font-medium">{advisor.label}</p>
                    <Badge variant="lightSecondary">{advisor.total}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </CardBox>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <CardBox className="h-full w-full">
            <CardHeader>
              <CardTitle>Resultado de visitas</CardTitle>
              <CardDescription>
                Estado actual de la agenda interna del tenant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.appointmentOutcomeReport.map((item) => (
                <div
                  className="border-border flex items-center justify-between rounded-xl border px-4 py-3"
                  key={item.status}
                >
                  <p className="text-sm font-medium">
                    {getAppointmentStatusLabel(item.status)}
                  </p>
                  <Badge variant={getAppointmentStatusTone(item.status)}>
                    {item.total}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </CardBox>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <CardBox className="h-full w-full">
            <CardHeader>
              <CardTitle>Primera respuesta</CardTitle>
              <CardDescription>
                Tiempo desde primer mensaje entrante hasta primera respuesta
                saliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
              <div className="border-border rounded-xl border px-4 py-3">
                <span className="text-muted-foreground">Promedio</span>
                <p className="mt-1 font-semibold">
                  {formatResponseMinutes(
                    summary.firstResponseReport.averageFirstResponseMinutes,
                  )}
                </p>
              </div>
              <div className="border-border rounded-xl border px-4 py-3">
                <span className="text-muted-foreground">Respondidas</span>
                <p className="mt-1 font-semibold">
                  {summary.firstResponseReport.respondedConversations}
                </p>
              </div>
              <div className="border-border rounded-xl border px-4 py-3">
                <span className="text-muted-foreground">Pendientes</span>
                <p className="mt-1 font-semibold">
                  {summary.firstResponseReport.pendingResponseConversations}
                </p>
              </div>
            </CardContent>
          </CardBox>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <CardBox className="h-full w-full">
            <CardHeader>
              <CardTitle>Últimos leads</CardTitle>
              <CardDescription>
                Actividad comercial reciente del tenant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.recentLeads.length === 0 ? (
                <EmptyState
                  title="Sin actividad reciente"
                  description="Los leads creados o ingresados por canales van a aparecer en esta lista."
                  actionHref="/dashboard/leads"
                  actionLabel="Ver leads"
                />
              ) : (
                summary.recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    className="border-border hover:border-primary/20 hover:bg-lightprimary/30 block rounded-xl border px-4 py-3 transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{lead.full_name}</p>
                      <Badge variant="gray">{lead.qualification_status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {lead.source ?? "sin fuente"} ·{" "}
                      {formatDateTime(lead.created_at)}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </CardBox>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <CardBox className="h-full w-full">
            <CardHeader>
              <CardTitle>Conversaciones recientes</CardTitle>
              <CardDescription>
                Últimos contactos entrando por canales conectados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.recentConversations.length === 0 ? (
                <EmptyState
                  title="Sin conversaciones recientes"
                  description="Los contactos entrantes por canales conectados van a aparecer acá."
                  actionHref="/dashboard/conversations"
                  actionLabel="Ver conversaciones"
                />
              ) : (
                summary.recentConversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/dashboard/conversations/${conversation.id}`}
                    className="border-border hover:border-primary/20 hover:bg-lightprimary/30 block rounded-xl border px-4 py-3 transition"
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
                        {conversation.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {formatDateTime(conversation.last_message_at)}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </CardBox>
        </div>
      </div>
    </div>
  );
}
