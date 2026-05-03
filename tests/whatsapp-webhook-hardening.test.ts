import {
  buildWebhookRejectionPayload,
  getUtf8ByteLength,
  isWebhookBodyTooLarge,
  WHATSAPP_WEBHOOK_LOG_BODY_LIMIT,
} from "@/server/services/whatsapp-webhook-hardening";

describe("whatsapp webhook hardening", () => {
  it("counts utf-8 body bytes instead of only string length", () => {
    expect(getUtf8ByteLength("abc")).toBe(3);
    expect(getUtf8ByteLength("á")).toBe(2);
  });

  it("detects webhook bodies above the configured byte limit", () => {
    expect(isWebhookBodyTooLarge("12345", 5)).toBe(false);
    expect(isWebhookBodyTooLarge("123456", 5)).toBe(true);
  });

  it("truncates logged body content while preserving metadata", () => {
    const body = "x".repeat(WHATSAPP_WEBHOOK_LOG_BODY_LIMIT + 10);

    expect(
      buildWebhookRejectionPayload({
        body,
        metadata: { reason: "invalid_signature" },
      }),
    ).toEqual({
      reason: "invalid_signature",
      body: `${"x".repeat(WHATSAPP_WEBHOOK_LOG_BODY_LIMIT)}...[truncated]`,
      body_bytes: body.length,
      body_truncated: true,
    });
  });
});
