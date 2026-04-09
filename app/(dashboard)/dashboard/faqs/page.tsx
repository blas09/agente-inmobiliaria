import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listFaqs } from "@/server/queries/faqs";

export default async function FaqsPage() {
	const { activeTenant } = await getActiveTenantContext();
	const faqs = await listFaqs(activeTenant.id);
	const activeFaqs = faqs.filter((faq) => faq.status === "active").length;

	return (
		<div className="space-y-6">
			<ProfileWelcome
				title="FAQs"
				action={
					<Link href="/dashboard/faqs/new">
						<Button>Nueva FAQ</Button>
					</Link>
				}
			/>
			<DashboardTopCards
				items={[
					{ key: "total", label: "FAQs", value: faqs.length, tone: "primary" },
					{ key: "active", label: "Activas", value: activeFaqs, tone: "success" },
					{ key: "inactive", label: "Inactivas", value: faqs.length - activeFaqs, tone: "warning" },
				]}
			/>
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
						<CardBox key={faq.id}>
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
						</CardBox>
					))}
				</div>
			)}
		</div>
	);
}
