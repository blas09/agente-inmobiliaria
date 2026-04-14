import { describe, expect, it } from "vitest";

import {
  processWhatsAppWebhook,
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
});
