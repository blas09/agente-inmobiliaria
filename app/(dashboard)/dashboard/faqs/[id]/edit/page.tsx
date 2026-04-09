import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getFaqById } from "@/server/queries/faqs";
import { deleteFaqAction, updateFaqAction } from "@/features/faqs/actions";
import { FaqForm } from "@/features/faqs/faq-form";

export default async function EditFaqPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { activeTenant } = await getActiveTenantContext();
	const faq = await getFaqById(activeTenant.id, id);
	const deleteAction = deleteFaqAction.bind(null, faq.id);

	return (
		<>
			<PageHeader
				title="Editar FAQ"
				description="Mantené las respuestas automáticas alineadas con las reglas del tenant."
			>
				<form action={deleteAction}>
					<Button type="submit" variant="destructive" shape="pill">
						Eliminar
					</Button>
				</form>
			</PageHeader>
			<FaqForm action={updateFaqAction.bind(null, faq.id)} initialValues={faq} />
		</>
	);
}
