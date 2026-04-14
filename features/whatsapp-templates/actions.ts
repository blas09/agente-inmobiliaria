"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireTenantAdminContext } from "@/server/auth/tenant-context";
import type { ActionState } from "@/types/actions";
import type { Database, Json } from "@/types/database";
import { whatsappTemplateSchema } from "@/features/whatsapp-templates/schema";

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? {})) as Json;
}

function parseTemplateFormData(formData: FormData) {
  let components: unknown[] = [];
  const rawComponents = formData.get("components");
  if (typeof rawComponents === "string" && rawComponents.trim().length > 0) {
    try {
      const parsed = JSON.parse(rawComponents);
      if (Array.isArray(parsed)) {
        components = parsed;
      }
    } catch {
      // Leave components empty; schema validation will catch invalid content if needed.
    }
  }

  return whatsappTemplateSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    language: formData.get("language")?.toString() ?? "en_US",
    category: formData.get("category")?.toString() ?? undefined,
    status: formData.get("status")?.toString() ?? "approved",
    is_active: formData.get("is_active") !== "false",
    components,
  });
}

export async function createWhatsAppTemplateAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const result = parseTemplateFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en el template.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("whatsapp_message_templates").insert({
    tenant_id: activeTenant.id,
    ...result.data,
    components: toJson(result.data.components),
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/channels");
  return { status: "success", message: "Template creado." };
}

export async function updateWhatsAppTemplateAction(
  templateId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const result = parseTemplateFormData(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "Hay campos inválidos en el template.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("whatsapp_message_templates")
    .update({
      ...result.data,
      components: toJson(result.data.components),
    })
    .eq("tenant_id", activeTenant.id)
    .eq("id", templateId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/channels");
  return { status: "success", message: "Template actualizado." };
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
  const { activeTenant } = await requireTenantAdminContext();
  const supabase = await createSupabaseServerClient();
  const templateId = formData.get("template_id")?.toString();
  const status = formData.get("status")?.toString();
  const isActive = formData.get("is_active");

  if (!templateId) {
    throw new Error("Falta el template.");
  }

  const patch: Database["public"]["Tables"]["whatsapp_message_templates"]["Update"] =
    {};
  if (status) {
    patch.status = status;
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

  revalidatePath("/dashboard/channels");
}
