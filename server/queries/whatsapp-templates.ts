import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  PaginationState,
  SortDirection,
} from "@/lib/pagination";

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

export type WhatsAppTemplateListSort =
  | "created"
  | "name"
  | "status"
  | "updated";

const whatsappTemplateSortColumns: Record<WhatsAppTemplateListSort, string> = {
  created: "created_at",
  name: "name",
  status: "status",
  updated: "updated_at",
};

export async function listWhatsAppTemplatesPaginated(
  tenantId: string,
  pagination: PaginationState,
  sorting: { sort: WhatsAppTemplateListSort; direction: SortDirection },
): Promise<
  PaginatedResult<Awaited<ReturnType<typeof listWhatsAppTemplates>>[number]>
> {
  const supabase = await createSupabaseServerClient();

  const { data, error, count } = await supabase
    .from("whatsapp_message_templates")
    .select(
      "id, tenant_id, name, language, category, status, is_active, components, status_updated_by, status_updated_at, approved_by, approved_at, created_at, updated_at",
      { count: "exact" },
    )
    .eq("tenant_id", tenantId)
    .order(whatsappTemplateSortColumns[sorting.sort], {
      ascending: sorting.direction === "asc",
      nullsFirst: false,
    })
    .range(pagination.from, pagination.to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

export async function getWhatsAppTemplateStats(tenantId: string) {
  const supabase = await createSupabaseServerClient();
  const [approvedActive, pending] = await Promise.all([
    supabase
      .from("whatsapp_message_templates")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "approved")
      .eq("is_active", true),
    supabase
      .from("whatsapp_message_templates")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "pending"),
  ]);

  if (approvedActive.error) {
    throw new Error(approvedActive.error.message);
  }

  if (pending.error) {
    throw new Error(pending.error.message);
  }

  return {
    approvedActive: approvedActive.count ?? 0,
    pending: pending.count ?? 0,
  };
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
