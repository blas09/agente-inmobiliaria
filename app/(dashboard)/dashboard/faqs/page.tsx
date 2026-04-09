import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listFaqs } from "@/server/queries/faqs";

export default async function FaqsPage() {
	const { activeTenant } = await getActiveTenantContext();
	const faqs = await listFaqs(activeTenant.id);
	const activeFaqs = faqs.filter((faq) => faq.status === "active").length;

	return (
		<>
			<PageHeader
				title="FAQs"
				description="Respuestas predefinidas del tenant para cubrir preguntas frecuentes antes de escalar."
				actionHref="/dashboard/faqs/new"
				actionLabel="Nueva FAQ"
			/>
			<section className="grid gap-4 md:grid-cols-3">
				<MetricCard label="FAQs" tone="primary" value={faqs.length} />
				<MetricCard label="Activas" tone="success" value={activeFaqs} />
				<MetricCard label="Inactivas" tone="warning" value={faqs.length - activeFaqs} />
			</section>
			{faqs.length === 0 ? (
				<EmptyState
					title="Todavía no hay FAQs"
					description="Las respuestas base del tenant permiten cubrir preguntas frecuentes con criterio editorial."
					actionHref="/dashboard/faqs/new"
					actionLabel="Crear FAQ"
				/>
			) : (
				<div className="grid gap-4">
					{faqs.map((faq) => (
						<Card key={faq.id}>
							<CardHeader>
								<div className="flex items-center justify-between gap-3">
									<div className="space-y-1">
										<Link href={`/dashboard/faqs/${faq.id}/edit`}>
											<CardTitle className="text-base hover:text-primary">{faq.question}</CardTitle>
										</Link>
										<CardDescription>{faq.category ?? "Sin categoría"}</CardDescription>
									</div>
									<Badge variant={faq.status === "active" ? "lightSuccess" : "outline"}>
										{faq.status}
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm leading-6 text-muted-foreground">{faq.answer}</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</>
	);
}
