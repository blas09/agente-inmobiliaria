import { describe, expect, it } from "vitest";

import {
  mapWhatsAppMessageStatus,
  processWhatsAppWebhook,
  shouldApplyStatusTransition,
  validateWhatsAppWebhookPayload,
} from "@/server/services/whatsapp-inbound";

describe("whatsapp inbound service", () => {
  it("ignores unsupported webhook objects", async () => {
    const result = await processWhatsAppWebhook({ object: "page" });

    expect(result.processed).toBe(0);
    expect(result.ignored).toBe(1);
    expect(result.results[0]?.status).toBe("ignored");
  });

  it("rejects invalid payload schema", () => {
    const result = validateWhatsAppWebhookPayload({
      object: "whatsapp_business_account",
      entry: [{ changes: "invalid" }],
    });

    expect(result.success).toBe(false);
  });

  it("accepts supported WhatsApp message and status payloads", () => {
    const result = validateWhatsAppWebhookPayload({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              field: "messages",
              value: {
                metadata: {
                  phone_number_id: "phone-number-1",
                },
                contacts: [
                  {
                    wa_id: "5491111111111",
                    profile: { name: "Ana" },
                  },
                ],
                messages: [
                  {
                    id: "wamid.1",
                    from: "5491111111111",
                    timestamp: "1777777777",
                    type: "text",
                    text: { body: "Hola" },
                  },
                ],
                statuses: [
                  {
                    id: "wamid.outbound.1",
                    status: "delivered",
                    timestamp: "1777777780",
                    recipient_id: "5491111111111",
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("maps only supported WhatsApp delivery statuses", () => {
    expect(mapWhatsAppMessageStatus("sent")).toBe("sent");
    expect(mapWhatsAppMessageStatus("delivered")).toBe("delivered");
    expect(mapWhatsAppMessageStatus("read")).toBe("read");
    expect(mapWhatsAppMessageStatus("failed")).toBe("failed");
    expect(mapWhatsAppMessageStatus("deleted")).toBeNull();
    expect(mapWhatsAppMessageStatus(undefined)).toBeNull();
  });

  it("applies status transitions idempotently without downgrading delivered messages", () => {
    expect(shouldApplyStatusTransition("sent", "delivered")).toBe(true);
    expect(shouldApplyStatusTransition("delivered", "read")).toBe(true);
    expect(shouldApplyStatusTransition("read", "delivered")).toBe(false);
    expect(shouldApplyStatusTransition("delivered", "failed")).toBe(false);
    expect(shouldApplyStatusTransition("failed", "sent")).toBe(false);
    expect(shouldApplyStatusTransition(null, "sent")).toBe(true);
  });
});
