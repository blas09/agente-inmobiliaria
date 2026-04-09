import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listConversations } from "@/server/queries/conversations";
import { formatDateTime } from "@/lib/utils";

export default async function ConversationsPage() {
	const { activeTenant } = await getActiveTenantContext();
	const conversations = await listConversations(activeTenant.id);
	const openCount = conversations.filter((conversation) => conversation.status === "open").length;
	const handoffCount = conversations.filter((conversation) => conversation.status === "pending_human").length;
	const aiEnabledCount = conversations.filter((conversation) => conversation.ai_enabled).length;

	return (
		<>
			<PageHeader
				title="Conversaciones"
				description="Hub conversacional preparado para WhatsApp y expansión futura a otros canales."
			/>
			<section className="grid gap-4 md:grid-cols-3">
				<MetricCard label="Abiertas" tone="primary" value={openCount} />
				<MetricCard label="Pendiente humano" tone="warning" value={handoffCount} />
				<MetricCard label="IA habilitada" tone="success" value={aiEnabledCount} />
			</section>
			{conversations.length === 0 ? (
				<EmptyState
					title="No hay conversaciones"
					description="Cuando empiecen a entrar mensajes por webhook o carga operativa, aparecerán acá."
					actionHref="/dashboard/channels"
					actionLabel="Revisar canales"
				/>
			) : (
				<div className="grid gap-4">
					{conversations.map((conversation) => (
						<Link href={`/dashboard/conversations/${conversation.id}`} key={conversation.id}>
							<Card className="transition hover:border-primary/20 hover:bg-lightprimary/15">
								<CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
									<div className="min-w-0 space-y-2">
										<div className="flex flex-wrap items-center gap-2">
											<p className="truncate font-semibold text-foreground">
												{conversation.contact_display_name ?? "Contacto sin nombre"}
											</p>
											<Badge variant={conversation.status === "pending_human" ? "lightWarning" : "outline"}>
												{conversation.status}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{conversation.contact_identifier ?? "Sin identificador"}
										</p>
										<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
											<span>Último mensaje {formatDateTime(conversation.last_message_at)}</span>
											{conversation.channels?.display_name ? (
												<>
													<span>•</span>
													<span>{conversation.channels.display_name}</span>
												</>
											) : null}
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Badge variant={conversation.ai_enabled ? "lightSuccess" : "gray"}>
											IA {conversation.ai_enabled ? "on" : "off"}
										</Badge>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</>
	);
}
