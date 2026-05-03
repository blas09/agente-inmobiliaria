import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { LeadForm } from "@/features/leads/lead-form";
import { updateLeadAction } from "@/features/leads/actions";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getLeadById, getPipelineStages } from "@/server/queries/leads";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { canManageLeads } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  if (!canManageLeads(activeMembership.role)) {
    redirect("/dashboard/leads");
  }
  const [lead, stages, advisors] = await Promise.all([
    getLeadById(activeTenant.id, id),
    getPipelineStages(activeTenant.id),
    getAssignableTenantUsers(activeTenant.id),
  ]);

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Editar lead"
        description="Actualizá datos comerciales, asignación y etapa para sostener el seguimiento."
      />
      <LeadForm
        action={updateLeadAction.bind(null, lead.id)}
        initialValues={lead}
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
