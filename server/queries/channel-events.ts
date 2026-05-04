import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  PaginationState,
  SortDirection,
} from "@/lib/pagination";

export interface ChannelHealthMetrics {
  since: string;
  outboundCount: number;
  outboundFailedCount: number;
  outboundRetryCount: number;
  outboundRetryFailedCount: number;
  webhookRejectedCount: number;
  inboundCount: number;
  deliveredCount: number;
  readCount: number;
  recentFailures: Array<{
    id: string;
    eventType: string;
    createdAt: string;
    errorMessage: string | null;
  }>;
}

export interface ChannelHealthEventRow {
  id: string;
  event_type: string;
  processing_status: string;
  error_message: string | null;
  created_at: string;
}

export type ChannelIncidentListSort = "created" | "event_type" | "status";

const channelIncidentSortColumns: Record<ChannelIncidentListSort, string> = {
  created: "created_at",
  event_type: "event_type",
  status: "processing_status",
};

export function buildChannelHealthMetrics(
  rows: ChannelHealthEventRow[],
  since: string,
): ChannelHealthMetrics {
  const recentFailures = rows
    .filter(
      (row) =>
        row.event_type.includes("failed") ||
        row.event_type.startsWith("whatsapp.webhook.") ||
        row.processing_status === "failed",
    )
    .slice(0, 5)
    .map((row) => ({
      id: row.id,
      eventType: row.event_type,
      createdAt: row.created_at,
      errorMessage: row.error_message,
    }));

  return {
    since,
    outboundCount: rows.filter(
      (row) => row.event_type === "whatsapp.message.outbound",
    ).length,
    outboundFailedCount: rows.filter(
      (row) => row.event_type === "whatsapp.message.outbound.failed",
    ).length,
    outboundRetryCount: rows.filter(
      (row) => row.event_type === "whatsapp.message.outbound.retry",
    ).length,
    outboundRetryFailedCount: rows.filter(
      (row) => row.event_type === "whatsapp.message.outbound.retry.failed",
    ).length,
    webhookRejectedCount: rows.filter((row) =>
      row.event_type.startsWith("whatsapp.webhook."),
    ).length,
    inboundCount: rows.filter(
      (row) => row.event_type === "whatsapp.message.inbound",
    ).length,
    deliveredCount: rows.filter(
      (row) => row.event_type === "whatsapp.status.delivered",
    ).length,
    readCount: rows.filter((row) => row.event_type === "whatsapp.status.read")
      .length,
    recentFailures,
  };
}

export async function getChannelHealthMetrics(
  tenantId: string,
  days = 7,
): Promise<ChannelHealthMetrics> {
  const supabase = await createSupabaseServerClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("channel_events")
    .select("id, event_type, processing_status, error_message, created_at")
    .eq("tenant_id", tenantId)
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  return buildChannelHealthMetrics(rows, since);
}

export async function listChannelIncidentsPaginated(
  tenantId: string,
  pagination: PaginationState,
  sorting: { sort: ChannelIncidentListSort; direction: SortDirection },
  days = 7,
): Promise<
  PaginatedResult<{
    id: string;
    eventType: string;
    processingStatus: string;
    createdAt: string;
    errorMessage: string | null;
  }>
> {
  const supabase = await createSupabaseServerClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error, count } = await supabase
    .from("channel_events")
    .select("id, event_type, processing_status, error_message, created_at", {
      count: "exact",
    })
    .eq("tenant_id", tenantId)
    .gte("created_at", since)
    .or(
      "event_type.ilike.%failed%,event_type.eq.webhook.rejected,processing_status.eq.failed,processing_status.eq.rejected",
    )
    .order(channelIncidentSortColumns[sorting.sort], {
      ascending: sorting.direction === "asc",
      nullsFirst: false,
    })
    .range(pagination.from, pagination.to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data ?? []).map((event) => ({
      id: event.id,
      eventType: event.event_type,
      processingStatus: event.processing_status,
      createdAt: event.created_at,
      errorMessage: event.error_message,
    })),
    total: count ?? 0,
  };
}
