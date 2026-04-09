import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/types/database";

type JsonRecord = Record<string, unknown>;

interface WhatsAppMetadata {
  phone_number_id?: string;
  display_phone_number?: string;
}

interface WhatsAppContact {
  profile?: {
    name?: string;
  };
  wa_id?: string;
}

interface WhatsAppMessage {
  id?: string;
  timestamp?: string;
  type?: string;
  text?: {
    body?: string;
  };
  image?: JsonRecord;
  audio?: JsonRecord;
  video?: JsonRecord;
  document?: JsonRecord;
}

interface WhatsAppStatus {
  id?: string;
  status?: string;
  timestamp?: string;
  recipient_id?: string;
}

interface WhatsAppValue {
  metadata?: WhatsAppMetadata;
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
}

interface WhatsAppChange {
  field?: string;
  value?: WhatsAppValue;
}

interface WhatsAppEntry {
  id?: string;
  changes?: WhatsAppChange[];
}

interface WhatsAppWebhookPayload {
  object?: string;
  entry?: WhatsAppEntry[];
}

type ProcessingResult =
  | {
      kind: "message";
      status: "processed" | "duplicate" | "ignored";
      detail: string;
    }
  | {
      kind: "status";
      status: "processed" | "duplicate" | "ignored";
      detail: string;
    };

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? {})) as Json;
}

function normalizePhone(value: string | null | undefined) {
  if (!value) return null;

  const normalized = value.replace(/\D/g, "");
  return normalized.length > 0 ? normalized : null;
}

function resolveMessageContent(message: WhatsAppMessage) {
  switch (message.type) {
    case "text":
      return {
        contentType: "text",
        content: message.text?.body ?? "",
      };
    case "image":
      return {
        contentType: "image",
        content: "[Imagen recibida por WhatsApp]",
      };
    case "audio":
      return {
        contentType: "audio",
        content: "[Audio recibido por WhatsApp]",
      };
    case "video":
      return {
        contentType: "video",
        content: "[Video recibido por WhatsApp]",
      };
    case "document":
      return {
        contentType: "document",
        content: "[Documento recibido por WhatsApp]",
      };
    default:
      return {
        contentType: "text",
        content: "[Mensaje recibido por WhatsApp]",
      };
  }
}

async function findChannelByPhoneNumberId(phoneNumberId: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("channel_whatsapp_accounts")
    .select("tenant_id, channel_id")
    .eq("phone_number_id", phoneNumberId)
    .eq("status", "connected")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to resolve WhatsApp channel: ${error.message}`);
  }

  return data;
}

async function findLeadByPhone(tenantId: string, phone: string | null) {
  if (!phone) return null;

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("leads")
    .select("id, phone, full_name")
    .eq("tenant_id", tenantId)
    .not("phone", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to lookup lead by phone: ${error.message}`);
  }

  return (
    (data ?? []).find((lead) => normalizePhone(lead.phone) === phone) ?? null
  );
}

async function createLeadFromWhatsApp(input: {
  tenantId: string;
  phone: string;
  fullName: string | null;
  channelId: string;
}) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("leads")
    .insert({
      tenant_id: input.tenantId,
      full_name: input.fullName ?? `Lead WhatsApp ${input.phone}`,
      phone: input.phone,
      source: "whatsapp",
      source_details: {
        channel_id: input.channelId,
        origin: "meta_whatsapp_cloud",
      },
      qualification_status: "new",
      is_human_handoff_required: false,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to create lead from WhatsApp: ${error?.message ?? "unknown error"}`,
    );
  }

  return data;
}

async function findOrCreateConversation(input: {
  tenantId: string;
  channelId: string;
  leadId: string | null;
  contactIdentifier: string;
  contactDisplayName: string | null;
  messageTimestamp: string;
}) {
  const admin = createSupabaseAdminClient();
  const { data: existingConversations, error: conversationLookupError } =
    await admin
      .from("conversations")
      .select("id, lead_id, status")
      .eq("tenant_id", input.tenantId)
      .eq("channel_id", input.channelId)
      .eq("contact_identifier", input.contactIdentifier)
      .order("updated_at", { ascending: false })
      .limit(1);

  if (conversationLookupError) {
    throw new Error(
      `Failed to lookup conversation: ${conversationLookupError.message}`,
    );
  }

  const existingConversation = existingConversations?.[0];

  if (existingConversation) {
    const nextStatus =
      existingConversation.status === "closed"
        ? "open"
        : existingConversation.status;

    const { data, error } = await admin
      .from("conversations")
      .update({
        lead_id: existingConversation.lead_id ?? input.leadId,
        contact_display_name: input.contactDisplayName,
        last_message_at: input.messageTimestamp,
        status: nextStatus,
        closed_at: null,
      })
      .eq("id", existingConversation.id)
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(
        `Failed to update conversation: ${error?.message ?? "unknown error"}`,
      );
    }

    return data;
  }

  const { data, error } = await admin
    .from("conversations")
    .insert({
      tenant_id: input.tenantId,
      channel_id: input.channelId,
      lead_id: input.leadId,
      status: "open",
      contact_identifier: input.contactIdentifier,
      contact_display_name: input.contactDisplayName,
      last_message_at: input.messageTimestamp,
      ai_enabled: true,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to create conversation: ${error?.message ?? "unknown error"}`,
    );
  }

  return data;
}

async function createChannelEvent(input: {
  tenantId: string | null;
  channelId: string | null;
  externalEventId: string | null;
  eventType: string;
  direction: "inbound" | "outbound" | null;
  payload: unknown;
  processingStatus: string;
  errorMessage?: string | null;
}) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("channel_events")
    .insert({
      tenant_id: input.tenantId,
      channel_id: input.channelId,
      provider: "meta_whatsapp_cloud",
      event_type: input.eventType,
      direction: input.direction,
      external_event_id: input.externalEventId,
      payload: toJson(input.payload),
      processing_status: input.processingStatus,
      error_message: input.errorMessage ?? null,
      processed_at: new Date().toISOString(),
    })
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return { duplicate: true, id: null };
    }

    throw new Error(`Failed to create channel event: ${error.message}`);
  }

  return { duplicate: false, id: data?.id ?? null };
}

async function createInboundMessage(input: {
  tenantId: string;
  conversationId: string;
  externalMessageId: string;
  content: string;
  contentType: string;
  rawPayload: unknown;
  receivedAt: string;
}) {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("messages").insert({
    tenant_id: input.tenantId,
    conversation_id: input.conversationId,
    sender_type: "lead",
    direction: "inbound",
    external_message_id: input.externalMessageId,
    content: input.content,
    content_type: input.contentType,
    message_status: "received",
    raw_payload: toJson(input.rawPayload),
    sent_at: input.receivedAt,
  });

  if (error) {
    if (error.code === "23505") {
      return { duplicate: true };
    }

    throw new Error(`Failed to persist inbound message: ${error.message}`);
  }

  return { duplicate: false };
}

async function processStatusEvent(input: {
  tenantId: string;
  channelId: string;
  status: WhatsAppStatus;
  rawPayload: unknown;
}) {
  const externalEventId = input.status.id ?? null;
  const eventResult = await createChannelEvent({
    tenantId: input.tenantId,
    channelId: input.channelId,
    externalEventId,
    eventType: `whatsapp.status.${input.status.status ?? "unknown"}`,
    direction: "outbound",
    payload: input.rawPayload,
    processingStatus: "processed",
  });

  if (eventResult.duplicate) {
    return {
      kind: "status" as const,
      status: "duplicate" as const,
      detail: "status event already processed",
    };
  }

  if (input.status.id && input.status.status) {
    const admin = createSupabaseAdminClient();
    const patch: Database["public"]["Tables"]["messages"]["Update"] = {
      message_status: input.status.status,
    };
    if (input.status.status === "delivered" && input.status.timestamp) {
      patch.delivered_at = new Date(
        Number(input.status.timestamp) * 1000,
      ).toISOString();
    }
    if (input.status.status === "read" && input.status.timestamp) {
      patch.read_at = new Date(
        Number(input.status.timestamp) * 1000,
      ).toISOString();
    }

    await admin
      .from("messages")
      .update(patch)
      .eq("tenant_id", input.tenantId)
      .eq("external_message_id", input.status.id);
  }

  return {
    kind: "status" as const,
    status: "processed" as const,
    detail: input.status.status ?? "unknown",
  };
}

async function processInboundMessage(input: {
  tenantId: string;
  channelId: string;
  message: WhatsAppMessage;
  contact: WhatsAppContact | undefined;
  rawPayload: unknown;
}) {
  const externalMessageId = input.message.id ?? null;
  if (!externalMessageId) {
    return {
      kind: "message" as const,
      status: "ignored" as const,
      detail: "message without id",
    };
  }

  const eventResult = await createChannelEvent({
    tenantId: input.tenantId,
    channelId: input.channelId,
    externalEventId: externalMessageId,
    eventType: "whatsapp.message.inbound",
    direction: "inbound",
    payload: input.rawPayload,
    processingStatus: "processed",
  });

  if (eventResult.duplicate) {
    return {
      kind: "message" as const,
      status: "duplicate" as const,
      detail: externalMessageId,
    };
  }

  const normalizedPhone = normalizePhone(input.contact?.wa_id);
  if (!normalizedPhone) {
    return {
      kind: "message" as const,
      status: "ignored" as const,
      detail: "message without contact identifier",
    };
  }

  const lead =
    (await findLeadByPhone(input.tenantId, normalizedPhone)) ??
    (await createLeadFromWhatsApp({
      tenantId: input.tenantId,
      phone: normalizedPhone,
      fullName: input.contact?.profile?.name ?? null,
      channelId: input.channelId,
    }));

  const receivedAt = input.message.timestamp
    ? new Date(Number(input.message.timestamp) * 1000).toISOString()
    : new Date().toISOString();
  const conversation = await findOrCreateConversation({
    tenantId: input.tenantId,
    channelId: input.channelId,
    leadId: lead.id,
    contactIdentifier: normalizedPhone,
    contactDisplayName: input.contact?.profile?.name ?? null,
    messageTimestamp: receivedAt,
  });

  const resolvedContent = resolveMessageContent(input.message);
  const messageInsert = await createInboundMessage({
    tenantId: input.tenantId,
    conversationId: conversation.id,
    externalMessageId,
    content: resolvedContent.content,
    contentType: resolvedContent.contentType,
    rawPayload: input.rawPayload,
    receivedAt,
  });

  if (messageInsert.duplicate) {
    return {
      kind: "message" as const,
      status: "duplicate" as const,
      detail: externalMessageId,
    };
  }

  return {
    kind: "message" as const,
    status: "processed" as const,
    detail: externalMessageId,
  };
}

export async function processWhatsAppWebhook(payload: unknown) {
  const webhookPayload = payload as WhatsAppWebhookPayload;
  const results: ProcessingResult[] = [];

  if (webhookPayload.object !== "whatsapp_business_account") {
    return {
      processed: 0,
      ignored: 1,
      duplicates: 0,
      results: [
        {
          kind: "message" as const,
          status: "ignored" as const,
          detail: "unsupported webhook object",
        },
      ],
    };
  }

  for (const entry of webhookPayload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      const phoneNumberId = value?.metadata?.phone_number_id;

      if (!phoneNumberId) {
        results.push({
          kind: "message",
          status: "ignored",
          detail: "missing phone_number_id",
        });
        continue;
      }

      const channel = await findChannelByPhoneNumberId(phoneNumberId);
      if (!channel) {
        await createChannelEvent({
          tenantId: null,
          channelId: null,
          externalEventId: null,
          eventType: "whatsapp.channel.unmatched",
          direction: "inbound",
          payload: change,
          processingStatus: "ignored",
          errorMessage: `No channel found for phone_number_id ${phoneNumberId}`,
        });

        results.push({
          kind: "message",
          status: "ignored",
          detail: `channel not found for ${phoneNumberId}`,
        });
        continue;
      }

      for (const status of value?.statuses ?? []) {
        results.push(
          await processStatusEvent({
            tenantId: channel.tenant_id,
            channelId: channel.channel_id,
            status,
            rawPayload: status,
          }),
        );
      }

      const primaryContact = value?.contacts?.[0];
      for (const message of value?.messages ?? []) {
        results.push(
          await processInboundMessage({
            tenantId: channel.tenant_id,
            channelId: channel.channel_id,
            message,
            contact: primaryContact,
            rawPayload: message,
          }),
        );
      }
    }
  }

  return {
    processed: results.filter((result) => result.status === "processed").length,
    ignored: results.filter((result) => result.status === "ignored").length,
    duplicates: results.filter((result) => result.status === "duplicate")
      .length,
    results,
  };
}
