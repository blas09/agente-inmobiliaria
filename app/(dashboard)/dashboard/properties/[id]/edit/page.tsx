import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { PropertyForm } from "@/features/properties/property-form";
import { updatePropertyAction } from "@/features/properties/actions";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getPropertyById } from "@/server/queries/properties";
import { canCreateBusinessRecords } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function EditPropertyPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { activeTenant, activeMembership } = await getActiveTenantContext();
	if (!canCreateBusinessRecords(activeMembership.role)) {
		redirect("/dashboard/properties");
	}
	const property = await getPropertyById(activeTenant.id, id);

	return (
		<div className="space-y-6">
			<ProfileWelcome title="Editar propiedad" />
			<PropertyForm action={updatePropertyAction.bind(null, property.id)} initialValues={property} />
		</div>
	);
}
