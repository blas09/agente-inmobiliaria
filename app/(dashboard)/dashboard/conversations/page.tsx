import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SortableHeader } from "@/components/shared/sortable-header";
import { Badge } from "@/components/ui/badge";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import {
  getConversationListStats,
  listConversationsPaginated,
  type ConversationListSort,
} from "@/server/queries/conversations";
import { resolvePagination, resolveSort } from "@/lib/pagination";
import { formatDateTime } from "@/lib/utils";
import { getConversationStatusLabel } from "@/lib/ui-labels";

const conversationSorts = [
  "last_message",
  "status",
  "contact",
] as const satisfies readonly ConversationListSort[];

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sort?: string;
    direction?: string;
  }>;
}) {
  const params = await searchParams;
  const { activeTenant } = await getActiveTenantContext();
  const pagination = resolvePagination(params, 10);
  const sorting = resolveSort(params, conversationSorts, {
    sort: "last_message",
    direction: "desc",
  });
  const [conversationResult, conversationStats] = await Promise.all([
    listConversationsPaginated(activeTenant.id, pagination, sorting),
    getConversationListStats(activeTenant.id),
  ]);
  const conversations = conversationResult.items;
  const listParams = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    sort: sorting.sort,
    direction: sorting.direction,
  };

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Conversaciones"
        description="Bandeja operativa para responder, asignar, vincular leads y avanzar hacia visitas."
      />
      <DashboardTopCards
        items={[
          {
            key: "open",
            label: "Abiertas",
            value: conversationStats.open,
            tone: "primary",
          },
          {
            key: "handoff",
            label: "Pendiente humano",
            value: conversationStats.handoff,
            tone: "warning",
          },
          {
            key: "ai",
            label: "IA habilitada",
            value: conversationStats.aiEnabled,
            tone: "success",
          },
        ]}
      />
      <section className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Bandeja</h2>
          <p className="text-muted-foreground mt-2">
            Ordená la bandeja completa sin cargar todas las conversaciones en
            pantalla.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <SortableHeader
            activeSort={sorting.sort}
            direction={sorting.direction}
            label="Último mensaje"
            params={listParams}
            pathname="/dashboard/conversations"
            sortKey="last_message"
          />
          <SortableHeader
            activeSort={sorting.sort}
            direction={sorting.direction}
            label="Contacto"
            params={listParams}
            pathname="/dashboard/conversations"
            sortKey="contact"
          />
          <SortableHeader
            activeSort={sorting.sort}
            direction={sorting.direction}
            label="Estado"
            params={listParams}
            pathname="/dashboard/conversations"
            sortKey="status"
          />
        </div>
      </section>
      {conversations.length === 0 ? (
        <EmptyState
          title="No hay conversaciones"
          description="Cuando empiecen a entrar mensajes por webhook o carga operativa, aparecerán acá."
          actionHref="/dashboard/channels"
          actionLabel="Revisar canales"
        />
      ) : (
        <div className="space-y-4">
          <CardBox className="overflow-hidden">
            <div className="divide-border divide-y">
              {conversations.map((conversation) => (
                <Link
                  className="hover:bg-lightprimary/15 grid gap-3 px-5 py-4 transition lg:grid-cols-[minmax(220px,1.2fr)_minmax(220px,1fr)_auto] lg:items-center"
                  href={`/dashboard/conversations/${conversation.id}`}
                  key={conversation.id}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {conversation.contact_display_name ??
                        "Contacto sin nombre"}
                    </p>
                    <p className="text-muted-foreground mt-1 truncate text-sm">
                      {conversation.contact_identifier ?? "Sin identificador"}
                    </p>
                  </div>
                  <div className="text-muted-foreground min-w-0 text-sm">
                    <p className="truncate">
                      Último mensaje{" "}
                      {formatDateTime(conversation.last_message_at)}
                    </p>
                    {conversation.channels?.display_name ? (
                      <p className="mt-1 truncate text-xs">
                        {conversation.channels.display_name}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <Badge
                      variant={
                        conversation.status === "pending_human"
                          ? "lightWarning"
                          : "outline"
                      }
                    >
                      {getConversationStatusLabel(conversation.status)}
                    </Badge>
                    <Badge
                      variant={
                        conversation.ai_enabled ? "lightSuccess" : "gray"
                      }
                    >
                      IA{" "}
                      {conversation.ai_enabled ? "habilitada" : "desactivada"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardBox>
          <PaginationControls
            page={pagination.page}
            pageSize={pagination.pageSize}
            params={listParams}
            pathname="/dashboard/conversations"
            total={conversationResult.total}
          />
        </div>
      )}
    </div>
  );
}
