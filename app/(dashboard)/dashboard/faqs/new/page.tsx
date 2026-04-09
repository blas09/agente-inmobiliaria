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
			<FaqForm action={createFaqAction} />
		</>
	);
}

