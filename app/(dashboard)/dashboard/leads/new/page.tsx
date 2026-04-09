import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { LeadForm } from "@/features/leads/lead-form";
import { createLeadAction } from "@/features/leads/actions";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getPipelineStages } from "@/server/queries/leads";
import { getAssignableTenantUsers } from "@/server/queries/tenants";

export default async function NewLeadPage() {
  const { activeTenant } = await getActiveTenantContext();
  const [stages, advisors] = await Promise.all([
    getPipelineStages(activeTenant.id),
    getAssignableTenantUsers(activeTenant.id),
  ]);

  return (
    <div className="space-y-6">
      <ProfileWelcome title="Nuevo lead" />
      <LeadForm
        action={createLeadAction}
        advisorOptions={advisors.map((advisor) => ({
          id: advisor.user_id,
          label:
            advisor.user_profiles?.full_name ??
            advisor.user_profiles?.email ??
            advisor.user_id,
          role: advisor.role,
        }))}
        stageOptions={stages.map((stage) => ({
          id: stage.id,
          name: stage.name,
        }))}
      />
    </div>
  );
}
