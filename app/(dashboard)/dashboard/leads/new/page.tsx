import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { LeadForm } from "@/features/leads/lead-form";
import { createLeadAction } from "@/features/leads/actions";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getPipelineStages } from "@/server/queries/leads";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { canManageLeads } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function NewLeadPage() {
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  if (!canManageLeads(activeMembership.role)) {
    redirect("/dashboard/leads");
  }
  const [stages, advisors] = await Promise.all([
    getPipelineStages(activeTenant.id),
    getAssignableTenantUsers(activeTenant.id),
  ]);

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Nuevo lead"
        description="Registrá el contacto comercial para calificarlo, asignarlo y avanzar hacia conversación o visita."
      />
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
