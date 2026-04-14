import { NextResponse } from "next/server";
import crypto from "crypto";

import { getEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  processWhatsAppWebhook,
  validateWhatsAppWebhookPayload,
} from "@/server/services/whatsapp-inbound";
import type { Json } from "@/types/database";

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? {})) as Json;
}

async function logWebhookRejection(input: {
  eventType: string;
  payload: unknown;
  errorMessage: string;
}) {
  try {
    const admin = createSupabaseAdminClient();
    await admin.from("channel_events").insert({
      tenant_id: null,
      channel_id: null,
      provider: "meta_whatsapp_cloud",
      event_type: input.eventType,
      direction: "inbound",
      external_event_id: null,
      payload: toJson(input.payload),
      processing_status: "failed",
      error_message: input.errorMessage,
      processed_at: new Date().toISOString(),
    });
  } catch {
    // Avoid failing webhook response if audit logging is unavailable.
  }
}

function verifySignature(rawBody: string, appSecret: string, signature: string) {
  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");

  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(signature, "utf8");
  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

export async function GET(request: Request) {
  const env = getEnv();
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    env.WHATSAPP_WEBHOOK_VERIFY_TOKEN &&
    token === env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  ) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json(
    { error: "Invalid webhook verification request" },
    { status: 403 },
  );
}

export async function POST(request: Request) {
  const env = getEnv();
  const signatureHeader = request.headers.get("x-hub-signature-256");
  const rawBody = await request.text();

  if (env.WHATSAPP_APP_SECRET) {
    if (!signatureHeader) {
      await logWebhookRejection({
        eventType: "whatsapp.webhook.missing_signature",
        payload: { body: rawBody },
        errorMessage: "Missing x-hub-signature-256 header",
      });
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 401 },
      );
    }

    const isValid = verifySignature(
      rawBody,
      env.WHATSAPP_APP_SECRET,
      signatureHeader,
    );

    if (!isValid) {
      await logWebhookRejection({
        eventType: "whatsapp.webhook.invalid_signature",
        payload: { body: rawBody },
        errorMessage: "Webhook signature verification failed",
      });
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      );
    }
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    await logWebhookRejection({
      eventType: "whatsapp.webhook.invalid_json",
      payload: { body: rawBody },
      errorMessage: "Invalid JSON payload",
    });
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsedPayload = validateWhatsAppWebhookPayload(payload);
  if (!parsedPayload.success) {
    const issues = parsedPayload.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    await logWebhookRejection({
      eventType: "whatsapp.webhook.invalid_payload",
      payload,
      errorMessage: `Invalid webhook payload schema: ${issues
        .map((issue) => `${issue.path || "<root>"} ${issue.message}`)
        .join("; ")}`,
    });

    return NextResponse.json(
      { error: "Invalid webhook payload", issues },
      { status: 400 },
    );
  }

  const result = await processWhatsAppWebhook(parsedPayload.data);

  return NextResponse.json({ ok: true, ...result });
}
