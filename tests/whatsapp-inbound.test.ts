import { describe, expect, it } from "vitest";

import { processWhatsAppWebhook } from "@/server/services/whatsapp-inbound";

describe("whatsapp inbound service", () => {
  it("ignores unsupported webhook objects", async () => {
    const result = await processWhatsAppWebhook({ object: "page" });

    expect(result.processed).toBe(0);
    expect(result.ignored).toBe(1);
    expect(result.results[0]?.status).toBe("ignored");
  });
});
