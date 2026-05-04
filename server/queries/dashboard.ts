import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildAdvisorReport,
  buildAppointmentOutcomeReport,
  buildFirstResponseReport,
  buildPipelineReport,
} from "@/server/queries/dashboard-reporting";
import type { Tables } from "@/types/database";

interface DashboardSummaryOptions {
  advisorId?: string;
}

interface DashboardUpcomingAppointment {
  id: string;
  scheduled_at: string;
  status: Tables<"appointments">["status"];
  leads: { id: string; full_name: string } | null;
  properties: { id: string; title: string } | null;
}

export async function getDashboardSummary(
  tenantId: string,
  options: DashboardSummaryOptions = {},
) {
  const supabase = await createSupabaseServerClient();
  const leadCountQuery = supabase
    .from("leads")
    .select("*", { head: true, count: "exact" })
    .eq("tenant_id", tenantId);
  const recentLeadsQuery = supabase
    .from("leads")
    .select(
      "id, full_name, source, qualification_status, assigned_to, created_at",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(5);
  const openConversationsQuery = supabase
    .from("conversations")
    .select("*", { head: true, count: "exact" })
    .eq("tenant_id", tenantId)
    .neq("status", "closed");
  const recentConversationsQuery = supabase
    .from("conversations")
    .select("id, status, contact_display_name, last_message_at")
    .eq("tenant_id", tenantId)
    .order("last_message_at", { ascending: false })
    .limit(5);
  const upcomingAppointmentsQuery = supabase
    .from("appointments")
    .select(
      "id, scheduled_at, status, leads(id, full_name), properties(id, title)",
    )
    .eq("tenant_id", tenantId)
    .in("status", ["scheduled", "confirmed"])
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(5);

  if (options.advisorId) {
    leadCountQuery.eq("assigned_to", options.advisorId);
    recentLeadsQuery.eq("assigned_to", options.advisorId);
    openConversationsQuery.eq("assigned_to", options.advisorId);
    recentConversationsQuery.eq("assigned_to", options.advisorId);
    upcomingAppointmentsQuery.eq("advisor_id", options.advisorId);
  }

  const [
    properties,
    leads,
    conversations,
    sources,
    recentLeads,
    recentConversations,
    leadReportRows,
    pipelineStages,
    appointments,
    upcomingAppointments,
    messages,
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("*", { head: true, count: "exact" })
      .eq("tenant_id", tenantId)
      .eq("status", "available"),
    leadCountQuery,
    openConversationsQuery,
    supabase.from("leads").select("source").eq("tenant_id", tenantId),
    recentLeadsQuery,
    recentConversationsQuery,
    supabase
      .from("leads")
      .select("assigned_to, pipeline_stage_id")
      .eq("tenant_id", tenantId),
    supabase
      .from("pipeline_stages")
      .select("id, name")
      .eq("tenant_id", tenantId)
      .order("position", { ascending: true }),
    supabase.from("appointments").select("status").eq("tenant_id", tenantId),
    upcomingAppointmentsQuery,
    supabase
      .from("messages")
      .select("conversation_id, direction, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true }),
  ]);

  const assignedAdvisorIds = Array.from(
    new Set(
      (leadReportRows.data ?? [])
        .map((lead) => lead.assigned_to)
        .filter((advisorId): advisorId is string => Boolean(advisorId)),
    ),
  );
  const advisors =
    assignedAdvisorIds.length > 0
      ? await supabase
          .from("user_profiles")
          .select("id, full_name, email")
          .in("id", assignedAdvisorIds)
      : { data: [], error: null };

  const leadsBySource = new Map<string, number>();
  for (const row of sources.data ?? []) {
    const key = row.source ?? "sin fuente";
    leadsBySource.set(key, (leadsBySource.get(key) ?? 0) + 1);
  }

  const advisorReport = buildAdvisorReport(
    leadReportRows.data ?? [],
    (advisors.data ?? []).map((advisor) => ({
      id: advisor.id,
      label: advisor.full_name ?? advisor.email,
    })),
  );
  const pipelineReport = buildPipelineReport(
    leadReportRows.data ?? [],
    (pipelineStages.data ?? []).map((stage) => ({
      id: stage.id,
      label: stage.name,
    })),
  );
  const appointmentOutcomeReport = buildAppointmentOutcomeReport(
    appointments.data ?? [],
  );
  const firstResponseReport = buildFirstResponseReport(messages.data ?? []);

  return {
    metrics: {
      activeProperties: properties.count ?? 0,
      leads: leads.count ?? 0,
      openConversations: conversations.count ?? 0,
    },
    leadsBySource: Array.from(leadsBySource.entries()).map(
      ([source, total]) => ({
        source,
        total,
      }),
    ),
    advisorReport,
    pipelineReport,
    appointmentOutcomeReport,
    firstResponseReport,
    recentLeads: recentLeads.data ?? [],
    recentConversations: recentConversations.data ?? [],
    upcomingAppointments:
      (upcomingAppointments.data as DashboardUpcomingAppointment[] | null) ??
      [],
  };
}
