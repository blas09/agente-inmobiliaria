import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listChannels } from "@/server/queries/channels";
import { formatDateTime } from "@/lib/utils";

export default async function ChannelsPage() {
	const { activeTenant } = await getActiveTenantContext();
	const channels = await listChannels(activeTenant.id);

	return (
		<>
			<PageHeader
				title="Canales"
				description="Capa SaaS preparada para canales conectados por cada inmobiliaria, empezando por WhatsApp."
			/>
			<div className="grid gap-4 lg:grid-cols-2">
				{channels.map((channel) => {
					const whatsappAccount = Array.isArray(channel.channel_whatsapp_accounts)
						? channel.channel_whatsapp_accounts[0]
						: channel.channel_whatsapp_accounts;

					return (
						<Card key={channel.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>{channel.display_name}</CardTitle>
										<p className="mt-1 text-sm text-muted-foreground">
											{channel.provider} · {channel.type}
										</p>
									</div>
									<Badge variant={channel.status === "connected" ? "success" : "outline"}>
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
									<div className="rounded-lg border border-border bg-slate-50 p-4">
										<p className="font-medium">{whatsappAccount.verified_name ?? "WhatsApp conectado"}</p>
										<p className="mt-1 text-muted-foreground">
											{whatsappAccount.display_phone_number ?? "Sin número visible"}
										</p>
										<p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
											Webhook {whatsappAccount.webhook_status}
										</p>
									</div>
								) : null}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</>
	);
}

