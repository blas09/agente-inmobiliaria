import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function listWhatsAppTemplates(tenantId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("whatsapp_message_templates")
    .select(
      "id, tenant_id, name, language, category, status, is_active, components, created_at, updated_at",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
