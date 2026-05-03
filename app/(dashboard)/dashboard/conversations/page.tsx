import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listConversations } from "@/server/queries/conversations";
import { formatDateTime } from "@/lib/utils";
import { getConversationStatusLabel } from "@/lib/ui-labels";

export default async function ConversationsPage() {
  const { activeTenant } = await getActiveTenantContext();
  const conversations = await listConversations(activeTenant.id);
  const openCount = conversations.filter(
    (conversation) => conversation.status === "open",
  ).length;
  const handoffCount = conversations.filter(
    (conversation) => conversation.status === "pending_human",
  ).length;
  const aiEnabledCount = conversations.filter(
    (conversation) => conversation.ai_enabled,
  ).length;

  return (
    <div className="space-y-6">
      <ProfileWelcome title="Conversaciones" />
      <DashboardTopCards
        items={[
          { key: "open", label: "Abiertas", value: openCount, tone: "primary" },
          {
            key: "handoff",
            label: "Pendiente humano",
            value: handoffCount,
            tone: "warning",
          },
          {
            key: "ai",
            label: "IA habilitada",
            value: aiEnabledCount,
            tone: "success",
          },
        ]}
      />
      {conversations.length === 0 ? (
        <EmptyState
          title="No hay conversaciones"
          description="Cuando empiecen a entrar mensajes por webhook o carga operativa, aparecerán acá."
          actionHref="/dashboard/channels"
          actionLabel="Revisar canales"
        />
      ) : (
        <div className="grid gap-6">
          {conversations.map((conversation) => (
            <Link
              href={`/dashboard/conversations/${conversation.id}`}
              key={conversation.id}
            >
              <CardBox className="hover:border-primary/20 hover:bg-lightprimary/15 transition">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="truncate">
                        {conversation.contact_display_name ??
                          "Contacto sin nombre"}
                      </CardTitle>
                      <CardDescription>
                        {conversation.contact_identifier ?? "Sin identificador"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        conversation.status === "pending_human"
                          ? "lightWarning"
                          : "outline"
                      }
                    >
                      {getConversationStatusLabel(conversation.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                      <span>
                        Último mensaje{" "}
                        {formatDateTime(conversation.last_message_at)}
                      </span>
                      {conversation.channels?.display_name ? (
                        <>
                          <span>•</span>
                          <span>{conversation.channels.display_name}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        conversation.ai_enabled ? "lightSuccess" : "gray"
                      }
                    >
                      IA{" "}
                      {conversation.ai_enabled ? "habilitada" : "desactivada"}
                    </Badge>
                  </div>
                </CardContent>
              </CardBox>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
