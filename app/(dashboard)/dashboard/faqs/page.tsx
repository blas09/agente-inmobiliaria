import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listFaqs } from "@/server/queries/faqs";

export default async function FaqsPage() {
	const { activeTenant } = await getActiveTenantContext();
	const faqs = await listFaqs(activeTenant.id);

	return (
		<>
			<PageHeader
				title="FAQs"
				description="Respuestas predefinidas del tenant para cubrir preguntas frecuentes antes de escalar."
				actionHref="/dashboard/faqs/new"
				actionLabel="Nueva FAQ"
			/>
			<div className="grid gap-4">
				{faqs.map((faq) => (
					<Card key={faq.id}>
						<CardHeader>
							<div className="flex items-center justify-between gap-3">
								<Link href={`/dashboard/faqs/${faq.id}/edit`}>
									<CardTitle className="text-base hover:text-teal-700">{faq.question}</CardTitle>
								</Link>
								<Badge variant={faq.status === "active" ? "success" : "outline"}>
									{faq.status}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">{faq.answer}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}

