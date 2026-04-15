import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { requireTenantAdminContext } from "@/server/auth/tenant-context";
import { canManageChannels } from "@/lib/permissions";
import { listChannels } from "@/server/queries/channels";
import { formatDateTime } from "@/lib/utils";
import { getChannelHealthMetrics } from "@/server/queries/channel-events";
import {
  listUserProfilesMap,
  listWhatsAppTemplates,
} from "@/server/queries/whatsapp-templates";
import { WhatsAppTemplateForm } from "@/features/whatsapp-templates/template-form";
import {
  createWhatsAppTemplateAction,
  updateWhatsAppTemplateStatusAction,
} from "@/features/whatsapp-templates/actions";

export default async function ChannelsPage() {
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  if (!canManageChannels(activeMembership.role)) {
    await requireTenantAdminContext();
  }
  const [channels, templates, health] = await Promise.all([
    listChannels(activeTenant.id),
    listWhatsAppTemplates(activeTenant.id),
    getChannelHealthMetrics(activeTenant.id),
  ]);
  const actorProfiles = await listUserProfilesMap(
    templates.flatMap((template) =>
      [template.status_updated_by, template.approved_by].filter(Boolean),
    ) as string[],
  );
  const connectedCount = channels.filter(
    (channel) => channel.status === "connected",
  ).length;

  const templateStatusVariant = (status: string | null) => {
    switch (status) {
      case "approved":
        return "lightSuccess";
      case "pending":
        return "lightWarning";
      case "rejected":
        return "lightError";
      case "paused":
        return "lightSecondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <ProfileWelcome title="Canales" />
      <DashboardTopCards
        items={[
          {
            key: "total",
            label: "Canales",
            value: channels.length,
            tone: "primary",
          },
          {
            key: "connected",
            label: "Conectados",
            value: connectedCount,
            tone: "success",
          },
          {
            key: "pending",
            label: "Pendientes",
            value: channels.length - connectedCount,
            tone: "warning",
          },
        ]}
      />
      <CardBox>
        <CardHeader>
          <CardTitle>Salud operativa del canal</CardTitle>
          <CardDescription>
            Ultimos 7 dias de actividad y fallos de WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="border-border bg-muted rounded-xl border p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
                Outbound
              </p>
              <p className="mt-2 text-2xl font-semibold">{health.outboundCount}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {health.deliveredCount} delivered · {health.readCount} read
              </p>
            </div>
            <div className="border-border bg-muted rounded-xl border p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
                Fallidos
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {health.outboundFailedCount}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {health.outboundRetryFailedCount} retries fallidos
              </p>
            </div>
            <div className="border-border bg-muted rounded-xl border p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
                Retries
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {health.outboundRetryCount}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Manuales ejecutados
              </p>
            </div>
            <div className="border-border bg-muted rounded-xl border p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
                Webhook rechazado
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {health.webhookRejectedCount}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Firmas invalidas detectadas
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">Incidentes recientes</p>
              <span className="text-muted-foreground text-xs">
                desde {formatDateTime(health.since)}
              </span>
            </div>
            {health.recentFailures.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay incidentes recientes registrados.
              </p>
            ) : (
              <div className="space-y-2">
                {health.recentFailures.map((event) => (
                  <div
                    key={event.id}
                    className="border-border bg-muted flex flex-col gap-2 rounded-xl border px-4 py-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium">{event.eventType}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDateTime(event.createdAt)}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {event.errorMessage ?? "Sin detalle adicional"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </CardBox>
      <div className="grid gap-4 lg:grid-cols-2">
        {channels.map((channel) => {
          const whatsappAccount = Array.isArray(
            channel.channel_whatsapp_accounts,
          )
            ? channel.channel_whatsapp_accounts[0]
            : channel.channel_whatsapp_accounts;

          return (
            <CardBox key={channel.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{channel.display_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {channel.provider} · {channel.type}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      channel.status === "connected"
                        ? "lightSuccess"
                        : "outline"
                    }
                  >
                    {channel.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Conectado:</span>{" "}
                  {formatDateTime(channel.connected_at)}
                </p>
                {whatsappAccount ? (
                  <div className="border-border bg-muted rounded-xl border p-4">
                    <p className="font-medium">
                      {whatsappAccount.verified_name ?? "WhatsApp conectado"}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {whatsappAccount.display_phone_number ??
                        "Sin número visible"}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs tracking-[0.18em] uppercase">
                      Webhook {whatsappAccount.webhook_status}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </CardBox>
          );
        })}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <WhatsAppTemplateForm action={createWhatsAppTemplateAction} />
        <CardBox>
          <CardHeader>
            <CardTitle>Templates WhatsApp</CardTitle>
            <CardDescription>
              Templates disponibles para el tenant activo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {templates.length === 0 ? (
              <p className="text-muted-foreground">
                Todavía no hay templates cargados.
              </p>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border-border bg-muted flex flex-col gap-4 rounded-xl border px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {template.language}{" "}
                          {template.category ? `· ${template.category}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!template.is_active ? (
                          <Badge variant="outline">inactive</Badge>
                        ) : null}
                        <Badge variant={templateStatusVariant(template.status)}>
                          {template.status ?? "unknown"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                      <p>
                        Ultimo cambio:{" "}
                        {template.status_updated_at
                          ? formatDateTime(template.status_updated_at)
                          : "Sin cambios"}
                      </p>
                      <p>
                        Por:{" "}
                        {template.status_updated_by
                          ? actorProfiles.get(template.status_updated_by)
                              ?.full_name ??
                            actorProfiles.get(template.status_updated_by)
                              ?.email ??
                            template.status_updated_by
                          : "Sin registrar"}
                      </p>
                      <p>
                        Aprobado:{" "}
                        {template.approved_at
                          ? formatDateTime(template.approved_at)
                          : "Todavía no"}
                      </p>
                      <p>
                        Aprobado por:{" "}
                        {template.approved_by
                          ? actorProfiles.get(template.approved_by)
                              ?.full_name ??
                            actorProfiles.get(template.approved_by)?.email ??
                            template.approved_by
                          : "Sin registrar"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <form action={updateWhatsAppTemplateStatusAction}>
                        <input
                          name="template_id"
                          type="hidden"
                          value={template.id}
                        />
                        <input name="status" type="hidden" value="approved" />
                        <Button size="sm" variant="secondary" type="submit">
                          Aprobar
                        </Button>
                      </form>
                      <form action={updateWhatsAppTemplateStatusAction}>
                        <input
                          name="template_id"
                          type="hidden"
                          value={template.id}
                        />
                        <input name="status" type="hidden" value="paused" />
                        <Button size="sm" variant="outline" type="submit">
                          Pausar
                        </Button>
                      </form>
                      <form action={updateWhatsAppTemplateStatusAction}>
                        <input
                          name="template_id"
                          type="hidden"
                          value={template.id}
                        />
                        <input name="status" type="hidden" value="rejected" />
                        <Button size="sm" variant="ghost" type="submit">
                          Rechazar
                        </Button>
                      </form>
                      <form action={updateWhatsAppTemplateStatusAction}>
                        <input
                          name="template_id"
                          type="hidden"
                          value={template.id}
                        />
                        <input
                          name="is_active"
                          type="hidden"
                          value={template.is_active ? "false" : "true"}
                        />
                        <Button size="sm" variant="ghost" type="submit">
                          {template.is_active ? "Desactivar" : "Activar"}
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CardBox>
      </div>
    </div>
  );
}
