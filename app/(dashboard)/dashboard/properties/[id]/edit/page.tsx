import { PageHeader } from "@/components/shared/page-header";
import { PropertyForm } from "@/features/properties/property-form";
import { updatePropertyAction } from "@/features/properties/actions";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getPropertyById } from "@/server/queries/properties";

export default async function EditPropertyPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { activeTenant } = await getActiveTenantContext();
	const property = await getPropertyById(activeTenant.id, id);

	return (
		<>
			<PageHeader
				title="Editar propiedad"
				description="Mantené consistente el catálogo que alimenta respuestas automáticas y operación humana."
			/>
			<PropertyForm action={updatePropertyAction.bind(null, property.id)} initialValues={property} />
		</>
	);
}

