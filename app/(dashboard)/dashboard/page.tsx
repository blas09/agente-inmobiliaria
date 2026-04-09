import { MessageCircleMore, Building2, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { getDashboardSummary } from "@/server/queries/dashboard";
import { getAppContext } from "@/server/auth/tenant-context";
import { getPlatformSummary } from "@/server/queries/tenants";
import { formatCompactNumber, formatDateTime } from "@/lib/utils";

const metricCards = [
	{
		key: "activeProperties",
		label: "Propiedades activas",
		icon: Building2,
	},
	{
		key: "leads",
		label: "Leads",
		icon: Users,
	},
	{
		key: "openConversations",
		label: "Conversaciones abiertas",
		icon: MessageCircleMore,
	},
] as const;

export default async function DashboardPage() {
	const context = await getAppContext();

	if (!context.activeTenant) {
		const summary = await getPlatformSummary();

		return (
			<>
				<PageHeader
					title="Panel de plataforma"
					description="Vista global para administración de tenants y gobierno del SaaS."
				/>
				<section className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader>
							<CardDescription>Tenants</CardDescription>
							<CardTitle className="text-3xl">{formatCompactNumber(summary.totalTenants)}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardDescription>Tenants activos</CardDescription>
							<CardTitle className="text-3xl">{formatCompactNumber(summary.activeTenants)}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardDescription>Membresías activas</CardDescription>
							<CardTitle className="text-3xl">
								{formatCompactNumber(summary.activeMemberships)}
							</CardTitle>
						</CardHeader>
					</Card>
				</section>
				<EmptyState
					title="Sin tenant activo"
					description="Como platform admin, podés crear tenants o sumarte a uno existente desde la sección de tenants."
				/>
			</>
		);
	}

	const { activeTenant } = context;
	const summary = await getDashboardSummary(activeTenant.id);

	return (
		<>
			<PageHeader
				title={`Panel de ${activeTenant.name}`}
				description="Base operativa del tenant activo: propiedades, leads, conversaciones y canales."
			/>
			<section className="grid gap-4 md:grid-cols-3">
				{metricCards.map((metric) => {
					const Icon = metric.icon;
					const value = summary.metrics[metric.key];

					return (
						<Card key={metric.key}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
								<div>
									<CardDescription>{metric.label}</CardDescription>
									<CardTitle className="mt-2 text-3xl">{formatCompactNumber(value)}</CardTitle>
								</div>
								<div className="rounded-full bg-teal-50 p-3 text-teal-700">
									<Icon className="h-5 w-5" />
								</div>
							</CardHeader>
						</Card>
					);
				})}
			</section>
			<section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<Card>
					<CardHeader>
						<CardTitle>Leads por fuente</CardTitle>
						<CardDescription>Lectura rápida del origen comercial del tenant.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{summary.leadsBySource.length === 0 ? (
							<EmptyState
								title="Sin leads todavía"
								description="Cuando entren consultas por WhatsApp, email o carga manual, aparecerán acá."
							/>
						) : (
							summary.leadsBySource.map((item) => (
								<div
									key={item.source}
									className="flex items-center justify-between rounded-lg border border-border bg-slate-50 px-4 py-3"
								>
									<p className="text-sm font-medium capitalize">{item.source}</p>
									<Badge variant="secondary">{item.total}</Badge>
								</div>
							))
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Contexto del tenant</CardTitle>
						<CardDescription>
							Parámetros centrales que condicionan pricing, idioma y operación.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Slug</span>
							<span className="font-medium">{activeTenant.slug}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Moneda principal</span>
							<span className="font-medium">{activeTenant.primary_currency}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Timezone</span>
							<span className="font-medium">{activeTenant.timezone}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Locale</span>
							<span className="font-medium">{activeTenant.locale}</span>
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Últimos leads</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{summary.recentLeads.map((lead) => (
							<div key={lead.id} className="rounded-lg border border-border px-4 py-3">
								<div className="flex items-center justify-between gap-3">
									<p className="font-medium">{lead.full_name}</p>
									<Badge variant="outline">{lead.qualification_status}</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									{lead.source ?? "sin fuente"} · {formatDateTime(lead.created_at)}
								</p>
							</div>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Conversaciones recientes</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{summary.recentConversations.map((conversation) => (
							<div key={conversation.id} className="rounded-lg border border-border px-4 py-3">
								<div className="flex items-center justify-between gap-3">
									<p className="font-medium">
										{conversation.contact_display_name ?? "Contacto sin nombre"}
									</p>
									<Badge variant="secondary">{conversation.status}</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									{formatDateTime(conversation.last_message_at)}
								</p>
							</div>
						))}
					</CardContent>
				</Card>
			</section>
		</>
	);
}
