import { PageHeader } from "@/components/shared/page-header";
import { createFaqAction } from "@/features/faqs/actions";
import { FaqForm } from "@/features/faqs/faq-form";

export default function NewFaqPage() {
	return (
		<>
			<PageHeader
				title="Nueva FAQ"
				description="Respuestas base del tenant para automatizar preguntas frecuentes con control editorial."
			/>
			<section className="mb-6 grid gap-4 md:grid-cols-3">
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Editorial</p>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						Las FAQs ayudan a responder más rápido sin depender de que el modelo invente información.
					</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Por tenant</p>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						Cada respuesta vive aislada dentro de la inmobiliaria activa.
					</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Control</p>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						Podés activarla o desactivarla sin perder el historial del contenido.
					</p>
				</div>
			</section>
			<FaqForm action={createFaqAction} />
		</>
	);
}
