import { createSupabaseServerClient } from "@/lib/supabase/server";
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
    .select("id, status, contact_display_name, last_message_at")
    .eq("tenant_id", tenantId)
    .eq("lead_id", leadId)
    .order("last_message_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load lead conversations: ${error.message}`);
  }

  return data ?? [];
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
