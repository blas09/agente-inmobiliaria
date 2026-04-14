import type {
  ChannelProvider,
  OutboundChannelMessage,
} from "@/integrations/channels/types";
import { resolveWhatsAppCredentials } from "@/integrations/channels/whatsapp/credentials";

interface WhatsAppErrorResponse {
  messages?: Array<{ id?: string }>;
  error?: { message?: string };
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableStatus(status: number) {
  return status === 429 || status >= 500;
}

export class WhatsAppCloudProvider implements ChannelProvider {
  async sendMessage(
    input: OutboundChannelMessage,
  ): Promise<{ externalMessageId?: string; rawResponse?: unknown }> {
    const metadata = input.metadata ?? {};
    const resolvedCredentials = resolveWhatsAppCredentials({
      credentialsRef:
        typeof metadata.credentialsRef === "string"
          ? metadata.credentialsRef
          : null,
      phoneNumberId:
        typeof metadata.phoneNumberId === "string"
          ? metadata.phoneNumberId
          : null,
    });

    const maxAttempts = 3;
    let lastError: Error | null = null;
    const templateName =
      typeof metadata.templateName === "string" ? metadata.templateName : null;
    const templateLanguage =
      typeof metadata.templateLanguage === "string"
        ? metadata.templateLanguage
        : "en_US";
    const templateComponents = Array.isArray(metadata.templateComponents)
      ? metadata.templateComponents
      : undefined;

    const messagePayload = templateName
      ? {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: input.recipientIdentifier,
          type: "template",
          template: {
            name: templateName,
            language: { code: templateLanguage },
            ...(templateComponents ? { components: templateComponents } : {}),
          },
        }
      : {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: input.recipientIdentifier,
          type: "text",
          text: {
            body: input.content,
          },
        };

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(
          `https://graph.facebook.com/${resolvedCredentials.apiVersion}/${resolvedCredentials.phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resolvedCredentials.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messagePayload),
            signal: controller.signal,
          },
        );

        const responseText = await response.text();
        let rawResponse: WhatsAppErrorResponse = {};
        if (responseText) {
          try {
            rawResponse = JSON.parse(responseText) as WhatsAppErrorResponse;
          } catch {
            rawResponse = {};
          }
        }

        if (!response.ok) {
          const errorMessage =
            rawResponse.error?.message ??
            `WhatsApp Cloud API request failed (${response.status}).`;
          const retryable = isRetryableStatus(response.status);
          if (!retryable || attempt === maxAttempts) {
            throw new Error(errorMessage);
          }

          await wait(attempt * 600);
          continue;
        }

        return {
          externalMessageId: rawResponse.messages?.[0]?.id,
          rawResponse: {
            ...rawResponse,
            attempt,
          },
        };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          lastError = new Error("WhatsApp Cloud API timed out.");
        } else if (error instanceof Error) {
          lastError = error;
        } else {
          lastError = new Error("WhatsApp Cloud API request failed.");
        }

        if (attempt === maxAttempts) {
          break;
        }

        await wait(attempt * 600);
      } finally {
        clearTimeout(timeout);
      }
    }

    throw lastError ?? new Error("WhatsApp Cloud API request failed.");
  }
}
