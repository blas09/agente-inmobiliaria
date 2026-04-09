"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toBoolean, toNullableInteger } from "@/lib/utils";
import { requireTenantAdminContext } from "@/server/auth/tenant-context";
import type { ActionState } from "@/types/actions";
import { pipelineStageSchema } from "@/features/pipeline/schema";

function parsePipelineStage(formData: FormData) {
  return pipelineStageSchema.safeParse({
    name: formData.get("name")?.toString().trim() ?? "",
    position: toNullableInteger(formData.get("position")) ?? 1,
    category: formData.get("category"),
    is_default: toBoolean(formData.get("is_default")),
  });
}

export async function createPipelineStageAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const result = parsePipelineStage(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en la etapa.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  if (result.data.is_default) {
    await supabase
      .from("pipeline_stages")
      .update({ is_default: false })
      .eq("tenant_id", activeTenant.id);
  }

  const { error } = await supabase.from("pipeline_stages").insert({
    tenant_id: activeTenant.id,
    name: result.data.name,
    position: result.data.position,
    category: result.data.category,
    is_default: result.data.is_default,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { status: "success", message: "Etapa creada." };
}

export async function updatePipelineStageAction(
  stageId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const result = parsePipelineStage(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en la etapa.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  if (result.data.is_default) {
    await supabase
      .from("pipeline_stages")
      .update({ is_default: false })
      .eq("tenant_id", activeTenant.id);
  }

  const { error } = await supabase
    .from("pipeline_stages")
    .update({
      name: result.data.name,
      position: result.data.position,
      category: result.data.category,
      is_default: result.data.is_default,
    })
    .eq("tenant_id", activeTenant.id)
    .eq("id", stageId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { status: "success", message: "Etapa actualizada." };
}
