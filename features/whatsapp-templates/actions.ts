"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireTenantAdminContext } from "@/server/auth/tenant-context";
import type { ActionState } from "@/types/actions";
import type { Database, Json } from "@/types/database";
import {
  parseWhatsAppTemplateComponents,
  whatsappTemplateSchema,
} from "@/features/whatsapp-templates/schema";

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? {})) as Json;
}

function parseTemplateFormData(formData: FormData) {
  let components: unknown[] = [];
  let componentErrors: string[] | undefined;
  const rawComponents = formData.get("components");
  if (typeof rawComponents === "string" && rawComponents.trim().length > 0) {
    try {
      const parsed = JSON.parse(rawComponents);
      const componentsResult = parseWhatsAppTemplateComponents(parsed);
      if (componentsResult.success) {
        components = componentsResult.data;
      } else {
        componentErrors = componentsResult.error.issues.map((issue) =>
          issue.path.length > 0
            ? `${issue.path.join(".")}: ${issue.message}`
            : issue.message,
        );
      }
    } catch {
      componentErrors = [
        "Los componentes deben ser un JSON válido con componentes de tipo body, header o button.",
      ];
    }
  }

  const result = whatsappTemplateSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    language: formData.get("language")?.toString() ?? "en_US",
    category: formData.get("category")?.toString() ?? undefined,
    status: formData.get("status")?.toString() ?? "approved",
    is_active: formData.get("is_active") !== "false",
    components,
  });

  if (componentErrors) {
    return {
      success: false as const,
      errorMessage: "Hay campos inválidos en la plantilla.",
      fieldErrors: {
        components: componentErrors,
      },
    };
  }

  if (!result.success) {
    return {
      success: false as const,
      errorMessage: "Hay campos inválidos en la plantilla.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

export async function createWhatsAppTemplateAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant, user } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const result = parseTemplateFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: result.errorMessage,
      fieldErrors: result.fieldErrors,
    };
  }

  const { error } = await supabase.from("whatsapp_message_templates").insert({
    tenant_id: activeTenant.id,
    ...result.data,
    components: toJson(result.data.components),
    status_updated_by: user.id,
    status_updated_at: new Date().toISOString(),
    approved_by: result.data.status === "approved" ? user.id : null,
    approved_at:
      result.data.status === "approved" ? new Date().toISOString() : null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/channels");
  return { status: "success", message: "Plantilla creada." };
}

export async function updateWhatsAppTemplateAction(
  templateId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant, user } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const result = parseTemplateFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: result.errorMessage,
      fieldErrors: result.fieldErrors,
    };
  }

  const auditNow = new Date().toISOString();
  const { error } = await supabase
    .from("whatsapp_message_templates")
    .update({
      ...result.data,
      components: toJson(result.data.components),
      status_updated_by: user.id,
      status_updated_at: auditNow,
      approved_by: result.data.status === "approved" ? user.id : undefined,
      approved_at: result.data.status === "approved" ? auditNow : undefined,
    })
    .eq("tenant_id", activeTenant.id)
    .eq("id", templateId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/channels");
  return { status: "success", message: "Plantilla actualizada." };
}

export async function deleteWhatsAppTemplateAction(templateId: string) {
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();

  await supabase
    .from("whatsapp_message_templates")
    .delete()
    .eq("tenant_id", activeTenant.id)
    .eq("id", templateId);

  revalidatePath("/dashboard/channels");
}

export async function updateWhatsAppTemplateStatusAction(formData: FormData) {
  const { activeTenant, user } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const templateId = formData.get("template_id")?.toString();
  const status = formData.get("status")?.toString();
  const isActive = formData.get("is_active");

  if (!templateId) {
    throw new Error("Falta la plantilla.");
  }

  const { data: currentTemplate, error: currentTemplateError } = await supabase
    .from("whatsapp_message_templates")
    .select("id, name, status, is_active")
    .eq("tenant_id", activeTenant.id)
    .eq("id", templateId)
    .maybeSingle();

  if (currentTemplateError || !currentTemplate) {
    throw new Error(
      currentTemplateError?.message ?? "No se encontró la plantilla.",
    );
  }

  const patch: Database["public"]["Tables"]["whatsapp_message_templates"]["Update"] =
    {
      status_updated_by: user.id,
      status_updated_at: new Date().toISOString(),
    };
  if (status) {
    patch.status = status;
    if (status === "approved") {
      patch.approved_by = user.id;
      patch.approved_at = patch.status_updated_at;
    }
  }
  if (isActive === "true") {
    patch.is_active = true;
  }
  if (isActive === "false") {
    patch.is_active = false;
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("No hay cambios para aplicar.");
  }

  const { error } = await supabase
    .from("whatsapp_message_templates")
    .update(patch)
    .eq("tenant_id", activeTenant.id)
    .eq("id", templateId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("channel_events").insert({
    tenant_id: activeTenant.id,
    channel_id: null,
    provider: "meta_whatsapp_cloud",
    event_type: "whatsapp.template.status_changed",
    direction: "outbound",
    payload: toJson({
      template_id: currentTemplate.id,
      template_name: currentTemplate.name,
      previous_status: currentTemplate.status,
      next_status: patch.status ?? currentTemplate.status,
      previous_active: currentTemplate.is_active,
      next_active: patch.is_active ?? currentTemplate.is_active,
      actor_user_id: user.id,
    }),
    processing_status: "processed",
    processed_at: patch.status_updated_at,
  });

  revalidatePath("/dashboard/channels");
}
