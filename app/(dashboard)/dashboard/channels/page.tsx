import Link from "next/link";

import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SortableHeader } from "@/components/shared/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { requireTenantAdminContext } from "@/server/auth/tenant-context";
import { canManageChannels } from "@/lib/permissions";
import { listChannels } from "@/server/queries/channels";
import { formatDateTime } from "@/lib/utils";
import {
  getChannelHealthMetrics,
  listChannelIncidentsPaginated,
  type ChannelIncidentListSort,
} from "@/server/queries/channel-events";
import {
  getWhatsAppTemplateStats,
  listUserProfilesMap,
  listWhatsAppTemplatesPaginated,
  type WhatsAppTemplateListSort,
} from "@/server/queries/whatsapp-templates";
import { resolvePagination, resolveSort } from "@/lib/pagination";
import { WhatsAppTemplateForm } from "@/features/whatsapp-templates/template-form";
import {
  createWhatsAppTemplateAction,
  updateWhatsAppTemplateStatusAction,
} from "@/features/whatsapp-templates/actions";
import {
  getChannelProviderLabel,
  getChannelEventTypeLabel,
  getChannelStatusLabel,
  getChannelTypeLabel,
  getWhatsAppTemplateCategoryLabel,
  getWhatsAppTemplateStatusLabel,
  getWhatsAppWebhookStatusLabel,
} from "@/lib/ui-labels";

const channelTabs = [
  { id: "status", label: "Estado" },
  { id: "templates", label: "Plantillas" },
  { id: "new-template", label: "Nueva plantilla" },
  { id: "incidents", label: "Incidentes" },
] as const;

type ChannelTabId = (typeof channelTabs)[number]["id"];

const templateSorts = [
  "created",
  "name",
  "status",
  "updated",
] as const satisfies readonly WhatsAppTemplateListSort[];

const incidentSorts = [
  "created",
  "event_type",
  "status",
] as const satisfies readonly ChannelIncidentListSort[];

function resolveChannelTab(tab: string | string[] | undefined): ChannelTabId {
  const value = Array.isArray(tab) ? tab[0] : tab;

  return channelTabs.some((item) => item.id === value)
    ? (value as ChannelTabId)
    : "status";
}

export default async function ChannelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string | string[];
    page?: string;
    pageSize?: string;
    sort?: string;
    direction?: string;
  }>;
}) {
  const params = await searchParams;
  const activeTab = resolveChannelTab(params.tab);
  const pagination = resolvePagination(
    params,
    activeTab === "templates" ? 12 : 10,
  );
  const templateSorting = resolveSort(params, templateSorts, {
    sort: "created",
    direction: "desc",
  });
  const incidentSorting = resolveSort(params, incidentSorts, {
    sort: "created",
    direction: "desc",
  });
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  if (!canManageChannels(activeMembership.role)) {
    await requireTenantAdminContext();
  }
  const [channels, templateStats, templateResult, incidentResult, health] =
    await Promise.all([
      listChannels(activeTenant.id),
      getWhatsAppTemplateStats(activeTenant.id),
      listWhatsAppTemplatesPaginated(
        activeTenant.id,
        pagination,
        templateSorting,
      ),
      listChannelIncidentsPaginated(
        activeTenant.id,
        pagination,
        incidentSorting,
      ),
      getChannelHealthMetrics(activeTenant.id),
    ]);
  const actorProfiles = await listUserProfilesMap(
    templateResult.items.flatMap((template) =>
      [template.status_updated_by, template.approved_by].filter(Boolean),
    ) as string[],
  );
  const templateListParams = {
    tab: "templates",
    page: pagination.page,
    pageSize: pagination.pageSize,
    sort: templateSorting.sort,
    direction: templateSorting.direction,
  };
  const incidentListParams = {
    tab: "incidents",
    page: pagination.page,
    pageSize: pagination.pageSize,
    sort: incidentSorting.sort,
    direction: incidentSorting.direction,
  };
  const connectedCount = channels.filter(
    (channel) => channel.status === "connected",
  ).length;
  const pendingCount = channels.length - connectedCount;
  const whatsappAccountCount = channels.filter((channel) => {
    const account = Array.isArray(channel.channel_whatsapp_accounts)
      ? channel.channel_whatsapp_accounts[0]
      : channel.channel_whatsapp_accounts;

    return Boolean(account);
  }).length;
  const approvedTemplateCount = templateStats.approvedActive;
  const pendingTemplateCount = templateStats.pending;
  const providerState =
    connectedCount > 0 && whatsappAccountCount > 0
      ? {
          title: "WhatsApp configurado para pruebas operativas",
          description:
            "El tenant tiene al menos un canal conectado. Revisá salud, webhooks y plantillas antes de una prueba real con proveedor.",
          badge: "Operativo",
          variant: "lightSuccess" as const,
        }
      : {
          title: "WhatsApp todavía requiere validación de proveedor",
          description:
            "La operación puede revisarse con datos de prueba, pero antes del piloto hay que confirmar cuenta, número, webhook y plantillas en Meta.",
          badge: "Pendiente",
          variant: "lightWarning" as const,
        };

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
      <ProfileWelcome
        title="Canales"
        description="Conexión y operación supervisada de WhatsApp para conversaciones, plantillas y eventos."
      />
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
            value: pendingCount,
            tone: "warning",
          },
        ]}
      />
      <div className="space-y-6">
        <nav className="border-border flex gap-2 overflow-x-auto border-b">
          {channelTabs.map((item) => (
            <Link
              className={
                activeTab === item.id
                  ? "border-primary text-primary border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap"
                  : "text-muted-foreground hover:text-foreground px-4 py-3 text-sm font-medium whitespace-nowrap"
              }
              href={`/dashboard/channels?tab=${item.id}`}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {activeTab === "status" ? (
          <section className="space-y-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  {providerState.title}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                  {providerState.description}
                </p>
              </div>
              <Badge className="w-fit" variant={providerState.variant}>
                {providerState.badge}
              </Badge>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-3">
              <div className="bg-muted rounded-md px-4 py-3">
                <p className="text-muted-foreground">Cuentas WhatsApp</p>
                <p className="mt-1 text-xl font-semibold">
                  {whatsappAccountCount}
                </p>
              </div>
              <div className="bg-muted rounded-md px-4 py-3">
                <p className="text-muted-foreground">Plantillas activas</p>
                <p className="mt-1 text-xl font-semibold">
                  {approvedTemplateCount}
                </p>
              </div>
              <div className="bg-muted rounded-md px-4 py-3">
                <p className="text-muted-foreground">Plantillas pendientes</p>
                <p className="mt-1 text-xl font-semibold">
                  {pendingTemplateCount}
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold">Canales conectados</h3>
                <p className="text-muted-foreground text-sm">
                  Cuentas y estado técnico visible para operar WhatsApp.
                </p>
              </div>
              {channels.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Todavía no hay canales configurados para este tenant.
                </p>
              ) : (
                <div className="divide-border divide-y">
                  {channels.map((channel) => {
                    const whatsappAccount = Array.isArray(
                      channel.channel_whatsapp_accounts,
                    )
                      ? channel.channel_whatsapp_accounts[0]
                      : channel.channel_whatsapp_accounts;

                    return (
                      <div
                        className="grid items-start gap-4 py-4 lg:grid-cols-[1.2fr_1fr_1fr_minmax(120px,auto)]"
                        key={channel.id}
                      >
                        <div>
                          <p className="font-medium">{channel.display_name}</p>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {getChannelProviderLabel(channel.provider)} ·{" "}
                            {getChannelTypeLabel(channel.type)}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Cuenta</p>
                          <p className="mt-1 font-medium">
                            {whatsappAccount?.verified_name ??
                              "Sin cuenta vinculada"}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            {whatsappAccount?.display_phone_number ??
                              "Sin número visible"}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Webhook</p>
                          <p className="mt-1 font-medium">
                            {whatsappAccount
                              ? getWhatsAppWebhookStatusLabel(
                                  whatsappAccount.webhook_status,
                                )
                              : "Sin cuenta vinculada"}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            {channel.connected_at
                              ? formatDateTime(channel.connected_at)
                              : "Sin conexión registrada"}
                          </p>
                        </div>
                        <div className="flex items-start lg:justify-end">
                          <Badge
                            className="self-start"
                            variant={
                              channel.status === "connected"
                                ? "lightSuccess"
                                : "outline"
                            }
                          >
                            {getChannelStatusLabel(channel.status)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold">Salud operativa</h3>
                <p className="text-muted-foreground text-sm">
                  Ultimos 7 dias de actividad y fallos de WhatsApp.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="bg-muted rounded-md p-4">
                  <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                    Outbound
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {health.outboundCount}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {health.deliveredCount} entregados · {health.readCount}{" "}
                    leídos
                  </p>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                    Fallidos
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {health.outboundFailedCount}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {health.outboundRetryFailedCount} retries fallidos
                  </p>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                    Retries
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {health.outboundRetryCount}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Manuales ejecutados
                  </p>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                    Webhook rechazado
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {health.webhookRejectedCount}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Rechazos registrados
                  </p>
                </div>
              </div>
            </section>
          </section>
        ) : null}

        {activeTab === "templates" ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Plantillas WhatsApp</h2>
              <p className="text-muted-foreground mt-2">
                Plantillas disponibles para respuestas y acciones operativas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 border-b pb-4 text-sm">
              <SortableHeader
                activeSort={templateSorting.sort}
                direction={templateSorting.direction}
                label="Creada"
                params={templateListParams}
                pathname="/dashboard/channels"
                sortKey="created"
              />
              <SortableHeader
                activeSort={templateSorting.sort}
                direction={templateSorting.direction}
                label="Nombre"
                params={templateListParams}
                pathname="/dashboard/channels"
                sortKey="name"
              />
              <SortableHeader
                activeSort={templateSorting.sort}
                direction={templateSorting.direction}
                label="Estado"
                params={templateListParams}
                pathname="/dashboard/channels"
                sortKey="status"
              />
              <SortableHeader
                activeSort={templateSorting.sort}
                direction={templateSorting.direction}
                label="Actualizada"
                params={templateListParams}
                pathname="/dashboard/channels"
                sortKey="updated"
              />
            </div>
            <div className="space-y-3 text-sm">
              {templateResult.items.length === 0 ? (
                <p className="text-muted-foreground">
                  Todavía no hay plantillas cargadas.
                </p>
              ) : (
                <div className="space-y-3">
                  {templateResult.items.map((template) => (
                    <div
                      key={template.id}
                      className="border-border bg-muted flex flex-col gap-4 rounded-xl border px-4 py-3"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {template.language}{" "}
                            {template.category
                              ? `· ${getWhatsAppTemplateCategoryLabel(
                                  template.category,
                                )}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!template.is_active ? (
                            <Badge variant="outline">Inactivo</Badge>
                          ) : null}
                          <Badge
                            variant={templateStatusVariant(template.status)}
                          >
                            {getWhatsAppTemplateStatusLabel(template.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-muted-foreground grid gap-2 text-xs md:grid-cols-2">
                        <p>
                          Ultimo cambio:{" "}
                          {template.status_updated_at
                            ? formatDateTime(template.status_updated_at)
                            : "Sin cambios"}
                        </p>
                        <p>
                          Por:{" "}
                          {template.status_updated_by
                            ? (actorProfiles.get(template.status_updated_by)
                                ?.full_name ??
                              actorProfiles.get(template.status_updated_by)
                                ?.email ??
                              template.status_updated_by)
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
                            ? (actorProfiles.get(template.approved_by)
                                ?.full_name ??
                              actorProfiles.get(template.approved_by)?.email ??
                              template.approved_by)
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
                          <Button
                            size="sm"
                            variant="lightsuccess"
                            type="submit"
                          >
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
                          <Button size="sm" variant="ghosterror" type="submit">
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
                  <PaginationControls
                    page={pagination.page}
                    pageSize={pagination.pageSize}
                    params={templateListParams}
                    pathname="/dashboard/channels"
                    total={templateResult.total}
                  />
                </div>
              )}
            </div>
          </section>
        ) : null}

        {activeTab === "new-template" ? (
          <section className="max-w-5xl">
            <WhatsAppTemplateForm
              action={createWhatsAppTemplateAction}
              variant="flat"
            />
          </section>
        ) : null}

        {activeTab === "incidents" ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Incidentes recientes</h2>
                <p className="text-muted-foreground mt-2">
                  Eventos fallidos o rechazados desde{" "}
                  {formatDateTime(health.since)}.
                </p>
              </div>
              <Badge
                variant={
                  incidentResult.total > 0 ? "lightError" : "lightSuccess"
                }
              >
                {incidentResult.total}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 border-b pb-4 text-sm">
              <SortableHeader
                activeSort={incidentSorting.sort}
                direction={incidentSorting.direction}
                label="Creado"
                params={incidentListParams}
                pathname="/dashboard/channels"
                sortKey="created"
              />
              <SortableHeader
                activeSort={incidentSorting.sort}
                direction={incidentSorting.direction}
                label="Evento"
                params={incidentListParams}
                pathname="/dashboard/channels"
                sortKey="event_type"
              />
              <SortableHeader
                activeSort={incidentSorting.sort}
                direction={incidentSorting.direction}
                label="Estado"
                params={incidentListParams}
                pathname="/dashboard/channels"
                sortKey="status"
              />
            </div>
            {incidentResult.items.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay incidentes recientes registrados.
              </p>
            ) : (
              <div className="divide-border divide-y">
                {incidentResult.items.map((event) => (
                  <div
                    key={event.id}
                    className="grid gap-3 py-4 md:grid-cols-[1fr_1fr]"
                  >
                    <div>
                      <p className="font-medium">
                        {getChannelEventTypeLabel(event.eventType)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatDateTime(event.createdAt)}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {event.errorMessage ?? "Sin detalle adicional"}
                    </p>
                  </div>
                ))}
                <PaginationControls
                  page={pagination.page}
                  pageSize={pagination.pageSize}
                  params={incidentListParams}
                  pathname="/dashboard/channels"
                  total={incidentResult.total}
                />
              </div>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
