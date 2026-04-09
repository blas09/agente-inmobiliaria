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
			<section className="mb-6 grid gap-4 md:grid-cols-3">
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Slug</p>
					<p className="mt-2 text-sm text-muted-foreground">{tenant.slug}</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Estado</p>
					<p className="mt-2 text-sm text-muted-foreground">{tenant.status}</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Timezone</p>
					<p className="mt-2 text-sm text-muted-foreground">{tenant.timezone}</p>
				</div>
			</section>
			<TenantForm action={updatePlatformTenantAction.bind(null, tenant.id)} initialValues={tenant} />
		</>
	);
}
