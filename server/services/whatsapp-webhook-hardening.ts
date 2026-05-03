import type { Json } from "@/types/database";

export const WHATSAPP_WEBHOOK_MAX_BODY_BYTES = 256 * 1024;
export const WHATSAPP_WEBHOOK_LOG_BODY_LIMIT = 4096;

export function getUtf8ByteLength(value: string) {
  return new TextEncoder().encode(value).length;
}

export function isWebhookBodyTooLarge(
  body: string,
  maxBytes = WHATSAPP_WEBHOOK_MAX_BODY_BYTES,
) {
  return getUtf8ByteLength(body) > maxBytes;
}

export function buildWebhookRejectionPayload(input: {
  body?: string;
  metadata?: Record<string, Json | undefined>;
}) {
  const body = input.body ?? "";
  const bodyBytes = getUtf8ByteLength(body);
  const truncatedBody =
    body.length > WHATSAPP_WEBHOOK_LOG_BODY_LIMIT
      ? `${body.slice(0, WHATSAPP_WEBHOOK_LOG_BODY_LIMIT)}...[truncated]`
      : body;

  return {
    ...input.metadata,
    body: truncatedBody,
    body_bytes: bodyBytes,
    body_truncated: truncatedBody !== body,
  } satisfies Record<string, Json | undefined>;
}
