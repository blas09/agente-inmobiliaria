import { buildChannelHealthMetrics } from "@/server/queries/channel-events";

const baseEvent = {
  processing_status: "processed",
  error_message: null,
  created_at: "2026-05-03T10:00:00.000Z",
};

describe("channel health metrics", () => {
  it("counts outbound, retry, inbound, delivery, and read events", () => {
    const metrics = buildChannelHealthMetrics(
      [
        { ...baseEvent, id: "1", event_type: "whatsapp.message.outbound" },
        {
          ...baseEvent,
          id: "2",
          event_type: "whatsapp.message.outbound.failed",
          processing_status: "failed",
        },
        {
          ...baseEvent,
          id: "3",
          event_type: "whatsapp.message.outbound.retry",
        },
        {
          ...baseEvent,
          id: "4",
          event_type: "whatsapp.message.outbound.retry.failed",
          processing_status: "failed",
        },
        { ...baseEvent, id: "5", event_type: "whatsapp.message.inbound" },
        { ...baseEvent, id: "6", event_type: "whatsapp.status.delivered" },
        { ...baseEvent, id: "7", event_type: "whatsapp.status.read" },
      ],
      "2026-05-01T00:00:00.000Z",
    );

    expect(metrics.outboundCount).toBe(1);
    expect(metrics.outboundFailedCount).toBe(1);
    expect(metrics.outboundRetryCount).toBe(1);
    expect(metrics.outboundRetryFailedCount).toBe(1);
    expect(metrics.inboundCount).toBe(1);
    expect(metrics.deliveredCount).toBe(1);
    expect(metrics.readCount).toBe(1);
  });

  it("counts all webhook rejection event types and exposes them as failures", () => {
    const metrics = buildChannelHealthMetrics(
      [
        {
          ...baseEvent,
          id: "1",
          event_type: "whatsapp.webhook.invalid_signature",
          processing_status: "failed",
          error_message: "Invalid signature",
        },
        {
          ...baseEvent,
          id: "2",
          event_type: "whatsapp.webhook.invalid_json",
          processing_status: "failed",
          error_message: "Invalid JSON",
        },
        {
          ...baseEvent,
          id: "3",
          event_type: "whatsapp.webhook.invalid_payload",
          processing_status: "failed",
          error_message: "Invalid payload",
        },
      ],
      "2026-05-01T00:00:00.000Z",
    );

    expect(metrics.webhookRejectedCount).toBe(3);
    expect(metrics.recentFailures.map((event) => event.eventType)).toEqual([
      "whatsapp.webhook.invalid_signature",
      "whatsapp.webhook.invalid_json",
      "whatsapp.webhook.invalid_payload",
    ]);
  });
});
