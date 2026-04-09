import Link from "next/link";
import { MessageCircleMore, Building2, Users, Shield } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
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
					<MetricCard
						icon={Building2}
						label="Tenants"
						tone="primary"
						value={formatCompactNumber(summary.totalTenants)}
					/>
					<MetricCard
						icon={Users}
						label="Tenants activos"
						tone="success"
						value={formatCompactNumber(summary.activeTenants)}
					/>
					<MetricCard
						icon={Shield}
						label="Membresías activas"
						tone="secondary"
						value={formatCompactNumber(summary.activeMemberships)}
					/>
				</section>
				<EmptyState
					title="Sin tenant activo"
					description="Como platform admin, podés crear tenants o sumarte a uno existente desde la sección de tenants."
					actionHref="/dashboard/platform/tenants"
					actionLabel="Ver tenants"
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
					const tone =
						metric.key === "activeProperties"
							? "primary"
							: metric.key === "leads"
								? "secondary"
								: "success";
					return (
						<MetricCard
							key={metric.key}
							icon={Icon}
							label={metric.label}
							tone={tone}
							value={formatCompactNumber(value)}
						/>
					);
				})}
			</section>
			<section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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
								actionHref="/dashboard/leads/new"
								actionLabel="Crear lead"
							/>
						) : (
							summary.leadsBySource.map((item) => (
								<div
									key={item.source}
									className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
								>
									<p className="text-sm font-medium capitalize">{item.source}</p>
									<Badge variant="gray">{item.total}</Badge>
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
					<CardContent className="grid gap-4 text-sm sm:grid-cols-2">
						<div className="rounded-xl border border-border px-4 py-3">
							<span className="text-muted-foreground">Slug</span>
							<p className="mt-1 font-semibold">{activeTenant.slug}</p>
						</div>
						<div className="rounded-xl border border-border px-4 py-3">
							<span className="text-muted-foreground">Moneda principal</span>
							<p className="mt-1 font-semibold">{activeTenant.primary_currency}</p>
						</div>
						<div className="rounded-xl border border-border px-4 py-3">
							<span className="text-muted-foreground">Timezone</span>
							<p className="mt-1 font-semibold">{activeTenant.timezone}</p>
						</div>
						<div className="rounded-xl border border-border px-4 py-3">
							<span className="text-muted-foreground">Locale</span>
							<p className="mt-1 font-semibold">{activeTenant.locale}</p>
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="grid gap-6 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Últimos leads</CardTitle>
						<CardDescription>Actividad comercial reciente del tenant.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{summary.recentLeads.map((lead) => (
							<Link
								key={lead.id}
								href={`/dashboard/leads/${lead.id}`}
								className="block rounded-xl border border-border px-4 py-3 transition hover:border-primary/20 hover:bg-lightprimary/30"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="font-medium">{lead.full_name}</p>
									<Badge variant="gray">{lead.qualification_status}</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									{lead.source ?? "sin fuente"} · {formatDateTime(lead.created_at)}
								</p>
							</Link>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Conversaciones recientes</CardTitle>
						<CardDescription>Últimos contactos entrando por canales conectados.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{summary.recentConversations.map((conversation) => (
							<Link
								key={conversation.id}
								href={`/dashboard/conversations/${conversation.id}`}
								className="block rounded-xl border border-border px-4 py-3 transition hover:border-primary/20 hover:bg-lightprimary/30"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="font-medium">
										{conversation.contact_display_name ?? "Contacto sin nombre"}
									</p>
									<Badge variant={conversation.status === "pending_human" ? "lightWarning" : "gray"}>
										{conversation.status}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									{formatDateTime(conversation.last_message_at)}
								</p>
							</Link>
						))}
					</CardContent>
				</Card>
			</section>
		</>
	);
}
