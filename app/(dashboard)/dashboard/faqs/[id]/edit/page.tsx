import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getFaqById } from "@/server/queries/faqs";
import { deleteFaqAction, updateFaqAction } from "@/features/faqs/actions";
import { FaqForm } from "@/features/faqs/faq-form";
import { canManageFaqs } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  if (!canManageFaqs(activeMembership.role)) {
    redirect("/dashboard/faqs");
  }
  const faq = await getFaqById(activeTenant.id, id);
  const deleteAction = deleteFaqAction.bind(null, faq.id);

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Editar FAQ"
        action={
          <form action={deleteAction}>
            <ConfirmSubmitButton confirmMessage="¿Eliminar esta FAQ? Esta acción no se puede deshacer.">
              Eliminar
            </ConfirmSubmitButton>
          </form>
        }
      />
      <FaqForm
        action={updateFaqAction.bind(null, faq.id)}
        initialValues={faq}
      />
    </div>
  );
}
