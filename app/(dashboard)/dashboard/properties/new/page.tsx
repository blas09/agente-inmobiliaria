import { PageHeader } from "@/components/shared/page-header";
import { PropertyForm } from "@/features/properties/property-form";
import { createPropertyAction } from "@/features/properties/actions";

export default function NewPropertyPage() {
	return (
		<>
			<PageHeader
				title="Nueva propiedad"
				description="Carga mínima pero estructurada para que ventas y automatización compartan la misma verdad."
			/>
			<PropertyForm action={createPropertyAction} />
		</>
	);
}

