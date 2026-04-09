import { PageHeader } from "@/components/shared/page-header";
import { TenantForm } from "@/features/tenants/tenant-form";
import { requirePlatformAdmin } from "@/server/auth/tenant-context";
import { getTenantById } from "@/server/queries/tenants";
import { updatePlatformTenantAction } from "@/features/tenants/actions";

export default async function EditPlatformTenantPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await requirePlatformAdmin();
	const { id } = await params;
	const tenant = await getTenantById(id);

	return (
		<>
			<PageHeader
				title={`Editar ${tenant.name}`}
				description="Administración de parámetros centrales del tenant desde plataforma."
			/>
			<TenantForm action={updatePlatformTenantAction.bind(null, tenant.id)} initialValues={tenant} />
		</>
	);
}
