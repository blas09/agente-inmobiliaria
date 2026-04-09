"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  toBoolean,
  toNullableInteger,
  toNullableNumber,
  toNullableString,
} from "@/lib/utils";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import type { ActionState } from "@/types/actions";
import type { LeadQualificationStatus } from "@/types/database";
import { leadSchema } from "@/features/leads/schema";

const leadQualificationStatuses = new Set([
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "nurturing",
  "won",
  "lost",
]);

function parseLeadFormData(formData: FormData) {
  const interestType = toNullableString(formData.get("interest_type"));
  const pipelineStageId = toNullableString(formData.get("pipeline_stage_id"));
  const assignedTo = toNullableString(formData.get("assigned_to"));

  return leadSchema.safeParse({
    full_name: formData.get("full_name")?.toString() ?? "",
    email: toNullableString(formData.get("email")) ?? "",
    phone: toNullableString(formData.get("phone")) ?? undefined,
    source: toNullableString(formData.get("source")) ?? undefined,
    interest_type: interestType === null ? null : interestType,
    budget_min: toNullableNumber(formData.get("budget_min")),
    budget_max: toNullableNumber(formData.get("budget_max")),
    desired_city: toNullableString(formData.get("desired_city")) ?? undefined,
    desired_neighborhood:
      toNullableString(formData.get("desired_neighborhood")) ?? undefined,
    bedrooms_needed: toNullableInteger(formData.get("bedrooms_needed")),
    financing_needed:
      formData.get("financing_needed") === null
        ? null
        : toBoolean(formData.get("financing_needed")),
    pets:
      formData.get("pets") === null ? null : toBoolean(formData.get("pets")),
    notes: toNullableString(formData.get("notes")) ?? undefined,
    qualification_status: formData.get("qualification_status"),
    score: toNullableInteger(formData.get("score")),
    pipeline_stage_id: pipelineStageId,
    assigned_to: assignedTo,
    is_human_handoff_required: toBoolean(
      formData.get("is_human_handoff_required"),
    ),
  });
}

async function ensureAssignableUser(tenantId: string, userId: string | null) {
  if (!userId) return true;

  const assignableUsers = await getAssignableTenantUsers(tenantId);
  return assignableUsers.some((user) => user.user_id === userId);
}

export async function createLeadAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await getActiveTenantContext();
  const supabase = await createSupabaseServerClient();
  const result = parseLeadFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en el lead.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  if (!(await ensureAssignableUser(activeTenant.id, result.data.assigned_to))) {
    return {
      status: "error",
      message:
        "El asesor seleccionado no pertenece al tenant o no puede recibir asignaciones.",
    };
  }

  const payload = {
    tenant_id: activeTenant.id,
    source_details: {},
    ...result.data,
    email: result.data.email || null,
  };

  const { error } = await supabase.from("leads").insert(payload);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/leads");
  redirect("/dashboard/leads");
}

export async function updateLeadAction(
  leadId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await getActiveTenantContext();
  const supabase = await createSupabaseServerClient();
  const result = parseLeadFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en el lead.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  if (!(await ensureAssignableUser(activeTenant.id, result.data.assigned_to))) {
    return {
      status: "error",
      message:
        "El asesor seleccionado no pertenece al tenant o no puede recibir asignaciones.",
    };
  }

  const { error } = await supabase
    .from("leads")
    .update({
      ...result.data,
      email: result.data.email || null,
    })
    .eq("tenant_id", activeTenant.id)
    .eq("id", leadId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);
  redirect(`/dashboard/leads/${leadId}`);
}

export async function updateLeadRoutingAction(
  leadId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant, user } = await getActiveTenantContext();
  const supabase = await createSupabaseServerClient();
  const assignedTo = toNullableString(formData.get("assigned_to"));
  const pipelineStageId = toNullableString(formData.get("pipeline_stage_id"));
  const qualificationStatus = formData.get("qualification_status")?.toString();
  const isHumanHandoffRequired = toBoolean(
    formData.get("is_human_handoff_required"),
  );

  if (
    !qualificationStatus ||
    !leadQualificationStatuses.has(qualificationStatus)
  ) {
    return {
      status: "error",
      message: "El estado comercial seleccionado no es válido.",
    };
  }

  if (!(await ensureAssignableUser(activeTenant.id, assignedTo))) {
    return {
      status: "error",
      message:
        "El asesor seleccionado no pertenece al tenant o no puede recibir asignaciones.",
    };
  }

  const { data: currentLead, error: currentLeadError } = await supabase
    .from("leads")
    .select("id, pipeline_stage_id")
    .eq("tenant_id", activeTenant.id)
    .eq("id", leadId)
    .single();

  if (currentLeadError || !currentLead) {
    return {
      status: "error",
      message: currentLeadError?.message ?? "Lead no encontrado.",
    };
  }

  const { error } = await supabase
    .from("leads")
    .update({
      assigned_to: assignedTo,
      pipeline_stage_id: pipelineStageId,
      qualification_status: qualificationStatus as LeadQualificationStatus,
      is_human_handoff_required: isHumanHandoffRequired,
    })
    .eq("tenant_id", activeTenant.id)
    .eq("id", leadId);

  if (error) {
    return { status: "error", message: error.message };
  }

  if (pipelineStageId && pipelineStageId !== currentLead.pipeline_stage_id) {
    await supabase.from("lead_stage_history").insert({
      tenant_id: activeTenant.id,
      lead_id: leadId,
      stage_id: pipelineStageId,
      changed_by: user.id,
      notes: "Cambio de etapa desde la vista de operación comercial.",
    });
  }

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);

  return {
    status: "success",
    message: "Operación comercial actualizada.",
  };
}

export async function deleteLeadAction(leadId: string) {
  const { activeTenant } = await getActiveTenantContext();
  const supabase = await createSupabaseServerClient();

  await supabase
    .from("leads")
    .delete()
    .eq("tenant_id", activeTenant.id)
    .eq("id", leadId);

  revalidatePath("/dashboard/leads");
  redirect("/dashboard/leads");
}
