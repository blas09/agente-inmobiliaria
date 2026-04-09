import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { createTenantAction } from "@/features/tenants/actions";
import { TenantForm } from "@/features/tenants/tenant-form";
import { requirePlatformAdmin } from "@/server/auth/tenant-context";

export default async function NewTenantPage() {
	await requirePlatformAdmin();

	return (
		<div className="space-y-6">
			<ProfileWelcome title="Nuevo tenant" />
			<section className="mb-6 grid gap-4 md:grid-cols-3">
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Owner existente</p>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						El owner inicial ya debe existir como usuario registrado en la plataforma.
					</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Tenant aislado</p>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						La nueva inmobiliaria nace con aislamiento por `tenant_id` y RLS desde el primer día.
					</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-5">
					<p className="text-sm font-medium text-foreground">Setup base</p>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						Slug, moneda, locale y timezone quedan listos para operar el workspace.
					</p>
				</div>
			</section>
			<TenantForm action={createTenantAction} showOwnerEmail />
		</div>
	);
}
