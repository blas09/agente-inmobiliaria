import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listChannels } from "@/server/queries/channels";
import { formatDateTime } from "@/lib/utils";

export default async function ChannelsPage() {
	const { activeTenant } = await getActiveTenantContext();
	const channels = await listChannels(activeTenant.id);
	const connectedCount = channels.filter((channel) => channel.status === "connected").length;

	return (
		<>
			<PageHeader
				title="Canales"
				description="Capa SaaS preparada para canales conectados por cada inmobiliaria, empezando por WhatsApp."
			/>
			<section className="grid gap-4 md:grid-cols-3">
				<MetricCard label="Canales" tone="primary" value={channels.length} />
				<MetricCard label="Conectados" tone="success" value={connectedCount} />
				<MetricCard label="Pendientes" tone="warning" value={channels.length - connectedCount} />
			</section>
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
										<CardDescription className="mt-1">
											{channel.provider} · {channel.type}
										</CardDescription>
									</div>
									<Badge variant={channel.status === "connected" ? "lightSuccess" : "outline"}>
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
									<div className="rounded-xl border border-border bg-muted p-4">
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
