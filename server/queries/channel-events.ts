import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const recentFailures = rows
    .filter(
      (row) =>
        row.event_type.includes("failed") ||
        row.event_type === "whatsapp.webhook.invalid_signature" ||
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
    webhookRejectedCount: rows.filter(
      (row) => row.event_type === "whatsapp.webhook.invalid_signature",
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
