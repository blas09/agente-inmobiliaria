import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  PaginationState,
  SortDirection,
} from "@/lib/pagination";
import type { LeadQualificationStatus, Tables } from "@/types/database";

const leadStatuses = new Set<LeadQualificationStatus>([
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "nurturing",
  "won",
  "lost",
]);

export async function listLeads(
  tenantId: string,
  filters?: { q?: string; status?: string },
) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("leads")
    .select(
      "id, full_name, email, phone, source, qualification_status, score, created_at, assigned_to, pipeline_stage_id",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (filters?.q) {
    query = query.or(
      `full_name.ilike.%${filters.q}%,email.ilike.%${filters.q}%,phone.ilike.%${filters.q}%`,
    );
  }

  if (
    filters?.status &&
    leadStatuses.has(filters.status as LeadQualificationStatus)
  ) {
    query = query.eq(
      "qualification_status",
      filters.status as LeadQualificationStatus,
    );
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load leads: ${error.message}`);
  }

  return data ?? [];
}

export type LeadListSort = "created" | "name" | "status" | "score";

const leadSortColumns: Record<LeadListSort, string> = {
  created: "created_at",
  name: "full_name",
  status: "qualification_status",
  score: "score",
};

export async function listLeadsPaginated(
  tenantId: string,
  filters: { q?: string; status?: string },
  pagination: PaginationState,
  sorting: { sort: LeadListSort; direction: SortDirection },
): Promise<
  PaginatedResult<
    Pick<
      Tables<"leads">,
      | "id"
      | "full_name"
      | "email"
      | "phone"
      | "source"
      | "qualification_status"
      | "score"
      | "created_at"
      | "assigned_to"
      | "pipeline_stage_id"
    >
  >
> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("leads")
    .select(
      "id, full_name, email, phone, source, qualification_status, score, created_at, assigned_to, pipeline_stage_id",
      { count: "exact" },
    )
    .eq("tenant_id", tenantId);

  if (filters.q) {
    query = query.or(
      `full_name.ilike.%${filters.q}%,email.ilike.%${filters.q}%,phone.ilike.%${filters.q}%`,
    );
  }

  if (
    filters.status &&
    leadStatuses.has(filters.status as LeadQualificationStatus)
  ) {
    query = query.eq(
      "qualification_status",
      filters.status as LeadQualificationStatus,
    );
  }

  const { data, error, count } = await query
    .order(leadSortColumns[sorting.sort], {
      ascending: sorting.direction === "asc",
      nullsFirst: false,
    })
    .range(pagination.from, pagination.to);

  if (error) {
    throw new Error(`Failed to load paginated leads: ${error.message}`);
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

async function countLeads(
  tenantId: string,
  filters: { q?: string; status?: string },
) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  if (filters.q) {
    query = query.or(
      `full_name.ilike.%${filters.q}%,email.ilike.%${filters.q}%,phone.ilike.%${filters.q}%`,
    );
  }

  if (
    filters.status &&
    leadStatuses.has(filters.status as LeadQualificationStatus)
  ) {
    query = query.eq(
      "qualification_status",
      filters.status as LeadQualificationStatus,
    );
  }

  const { error, count } = await query;
  if (error) {
    throw new Error(`Failed to count leads: ${error.message}`);
  }

  return count ?? 0;
}

export async function getLeadListStats(
  tenantId: string,
  filters: { q?: string; status?: string },
) {
  const [newCount, qualified] = await Promise.all([
    countLeads(tenantId, { ...filters, status: "new" }),
    countLeads(tenantId, { ...filters, status: "qualified" }),
  ]);

  return { new: newCount, qualified };
}

export async function getLeadById(
  tenantId: string,
  leadId: string,
): Promise<Tables<"leads">> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", leadId)
    .single();

  if (error) {
    throw new Error(`Failed to load lead: ${error.message}`);
  }

  return data;
}

export async function getLeadConversations(tenantId: string, leadId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id, status, contact_display_name, last_message_at, property_id, properties(id, title, external_ref)",
    )
    .eq("tenant_id", tenantId)
    .eq("lead_id", leadId)
    .order("last_message_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load lead conversations: ${error.message}`);
  }

  return (data ?? []) as unknown as Array<{
    id: string;
    status: string;
    contact_display_name: string | null;
    last_message_at: string | null;
    property_id: string | null;
    properties: {
      id: string;
      title: string;
      external_ref: string | null;
    } | null;
  }>;
}

export async function getPipelineStages(tenantId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pipeline_stages")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(`Failed to load pipeline stages: ${error.message}`);
  }

  return data ?? [];
}

export async function getLeadStageHistory(tenantId: string, leadId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lead_stage_history")
    .select("id, changed_at, notes, stage_id")
    .eq("tenant_id", tenantId)
    .eq("lead_id", leadId)
    .order("changed_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load lead stage history: ${error.message}`);
  }

  return data ?? [];
}
