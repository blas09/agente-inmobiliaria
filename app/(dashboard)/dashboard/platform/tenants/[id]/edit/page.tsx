import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { TenantForm } from "@/features/tenants/tenant-form";
import { requirePlatformAdmin } from "@/server/auth/tenant-context";
import { getTenantById } from "@/server/queries/tenants";
import { updatePlatformTenantAction } from "@/features/tenants/actions";
import { getTenantStatusLabel } from "@/lib/ui-labels";

export default async function EditPlatformTenantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePlatformAdmin();
  const { id } = await params;
  const tenant = await getTenantById(id);

  return (
    <div className="space-y-6">
      <ProfileWelcome title={`Editar ${tenant.name}`} />
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-sm font-medium">Slug</p>
          <p className="text-muted-foreground mt-2 text-sm">{tenant.slug}</p>
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-sm font-medium">Estado</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {getTenantStatusLabel(tenant.status)}
          </p>
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-sm font-medium">Timezone</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {tenant.timezone}
          </p>
        </div>
      </section>
      <TenantForm
        action={updatePlatformTenantAction.bind(null, tenant.id)}
        initialValues={tenant}
      />
    </div>
  );
}
