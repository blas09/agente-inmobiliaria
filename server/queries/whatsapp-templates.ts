import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function listWhatsAppTemplates(tenantId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("whatsapp_message_templates")
    .select(
      "id, tenant_id, name, language, category, status, is_active, components, status_updated_by, status_updated_at, approved_by, approved_at, created_at, updated_at",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function listActiveWhatsAppTemplates(tenantId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("whatsapp_message_templates")
    .select(
      "id, tenant_id, name, language, category, status, is_active, components, status_updated_by, status_updated_at, approved_by, approved_at, created_at, updated_at",
    )
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function listUserProfilesMap(userIds: string[]) {
  const supabase = await createSupabaseServerClient();
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)));

  if (uniqueUserIds.length === 0) {
    return new Map<string, { id: string; full_name: string; email: string }>();
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, full_name, email")
    .in("id", uniqueUserIds);

  if (error) {
    throw new Error(error.message);
  }

  return new Map((data ?? []).map((profile) => [profile.id, profile]));
}
