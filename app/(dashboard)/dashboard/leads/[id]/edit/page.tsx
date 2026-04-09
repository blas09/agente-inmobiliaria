import { PageHeader } from "@/components/shared/page-header";
import { LeadForm } from "@/features/leads/lead-form";
import { updateLeadAction } from "@/features/leads/actions";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getLeadById, getPipelineStages } from "@/server/queries/leads";
import { getAssignableTenantUsers } from "@/server/queries/tenants";

export default async function EditLeadPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { activeTenant } = await getActiveTenantContext();
	const [lead, stages, advisors] = await Promise.all([
		getLeadById(activeTenant.id, id),
		getPipelineStages(activeTenant.id),
		getAssignableTenantUsers(activeTenant.id),
	]);

	return (
		<>
			<PageHeader
				title="Editar lead"
				description="Ajustá calificación, etapa y contexto estructurado de la oportunidad."
			/>
			<LeadForm
				action={updateLeadAction.bind(null, lead.id)}
				initialValues={lead}
				advisorOptions={advisors.map((advisor) => ({
					id: advisor.user_id,
					label: advisor.user_profiles?.full_name ?? advisor.user_profiles?.email ?? advisor.user_id,
					role: advisor.role,
				}))}
				stageOptions={stages.map((stage) => ({ id: stage.id, name: stage.name }))}
			/>
		</>
	);
}
