import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { PropertyForm } from "@/features/properties/property-form";
import { createPropertyAction } from "@/features/properties/actions";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { canManageProperties } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const { activeMembership } = await getActiveTenantContext();
  if (!canManageProperties(activeMembership.role)) {
    redirect("/dashboard/properties");
  }

  return (
    <div className="space-y-6">
      <ProfileWelcome title="Nueva propiedad" />
      <PropertyForm action={createPropertyAction} />
    </div>
  );
}
