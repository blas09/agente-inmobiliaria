import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listConversations } from "@/server/queries/conversations";
import { formatDateTime } from "@/lib/utils";

export default async function ConversationsPage() {
	const { activeTenant } = await getActiveTenantContext();
	const conversations = await listConversations(activeTenant.id);

	return (
		<>
			<PageHeader
				title="Conversaciones"
				description="Hub conversacional preparado para WhatsApp y expansión futura a otros canales."
			/>
			{conversations.length === 0 ? (
				<EmptyState
					title="No hay conversaciones"
					description="Cuando empiecen a entrar mensajes por webhook o carga operativa, aparecerán acá."
				/>
			) : (
				<div className="grid gap-4">
					{conversations.map((conversation) => (
						<Link href={`/dashboard/conversations/${conversation.id}`} key={conversation.id}>
							<Card className="p-5 transition hover:border-teal-300 hover:shadow-md">
								<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<div className="space-y-1">
										<div className="flex items-center gap-3">
											<p className="font-medium">
												{conversation.contact_display_name ?? "Contacto sin nombre"}
											</p>
											<Badge variant={conversation.status === "pending_human" ? "warning" : "outline"}>
												{conversation.status}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{conversation.contact_identifier ?? "Sin identificador"} ·{" "}
											{formatDateTime(conversation.last_message_at)}
										</p>
									</div>
									<div className="text-sm text-muted-foreground">
										IA {conversation.ai_enabled ? "habilitada" : "deshabilitada"}
									</div>
								</div>
							</Card>
						</Link>
					))}
				</div>
			)}
		</>
	);
}

