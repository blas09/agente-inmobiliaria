import { PageHeader } from "@/components/shared/page-header";
import { createTenantAction } from "@/features/tenants/actions";
import { TenantForm } from "@/features/tenants/tenant-form";
import { requirePlatformAdmin } from "@/server/auth/tenant-context";

export default async function NewTenantPage() {
	await requirePlatformAdmin();

	return (
		<>
			<PageHeader
				title="Nuevo tenant"
				description="Alta de una nueva inmobiliaria con owner inicial ya existente en la plataforma."
			/>
			<TenantForm action={createTenantAction} showOwnerEmail />
		</>
	);
}

