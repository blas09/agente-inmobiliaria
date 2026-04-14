import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/types/database";
import { z } from "zod";

const jsonRecordSchema = z.record(z.string(), z.unknown());

const whatsAppMetadataSchema = z
  .object({
    phone_number_id: z.string().optional(),
    display_phone_number: z.string().optional(),
  })
  .passthrough();

const whatsAppContactSchema = z
  .object({
    profile: z
      .object({
        name: z.string().optional(),
      })
      .passthrough()
      .optional(),
    wa_id: z.string().optional(),
  })
  .passthrough();

const whatsAppMessageSchema = z
  .object({
    id: z.string().optional(),
    timestamp: z.string().optional(),
    type: z.string().optional(),
    text: z
      .object({
        body: z.string().optional(),
      })
      .passthrough()
      .optional(),
    image: jsonRecordSchema.optional(),
    audio: jsonRecordSchema.optional(),
    video: jsonRecordSchema.optional(),
    document: jsonRecordSchema.optional(),
  })
  .passthrough();

const whatsAppStatusSchema = z
  .object({
    id: z.string().optional(),
    status: z.string().optional(),
    timestamp: z.string().optional(),
    recipient_id: z.string().optional(),
  })
  .passthrough();

const whatsAppValueSchema = z
  .object({
    metadata: whatsAppMetadataSchema.optional(),
    contacts: z.array(whatsAppContactSchema).optional(),
    messages: z.array(whatsAppMessageSchema).optional(),
    statuses: z.array(whatsAppStatusSchema).optional(),
  })
  .passthrough();

const whatsAppChangeSchema = z
  .object({
    field: z.string().optional(),
    value: whatsAppValueSchema.optional(),
  })
  .passthrough();

const whatsAppEntrySchema = z
  .object({
    id: z.string().optional(),
    changes: z.array(whatsAppChangeSchema).optional(),
  })
  .passthrough();

const whatsAppWebhookPayloadSchema = z
  .object({
    object: z.string().optional(),
    entry: z.array(whatsAppEntrySchema).optional(),
  })
  .passthrough();

export type WhatsAppMetadata = z.infer<typeof whatsAppMetadataSchema>;
export type WhatsAppContact = z.infer<typeof whatsAppContactSchema>;
export type WhatsAppMessage = z.infer<typeof whatsAppMessageSchema>;
export type WhatsAppStatus = z.infer<typeof whatsAppStatusSchema>;
export type WhatsAppValue = z.infer<typeof whatsAppValueSchema>;
export type WhatsAppChange = z.infer<typeof whatsAppChangeSchema>;
export type WhatsAppEntry = z.infer<typeof whatsAppEntrySchema>;
export type WhatsAppWebhookPayload = z.infer<typeof whatsAppWebhookPayloadSchema>;

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

export function validateWhatsAppWebhookPayload(payload: unknown) {
  return whatsAppWebhookPayloadSchema.safeParse(payload);
}

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

function mapWhatsAppMessageStatus(status: string | undefined) {
  if (!status) return null;
  switch (status) {
    case "sent":
    case "delivered":
    case "read":
    case "failed":
      return status;
    default:
      return null;
  }
}

function shouldApplyStatusTransition(
  currentStatus: string | null,
  incomingStatus: string,
) {
  if (!currentStatus) return true;

  if (currentStatus === "failed") {
    return false;
  }

  if (incomingStatus === "failed") {
    return currentStatus !== "read" && currentStatus !== "delivered";
  }

  const rank: Record<string, number> = {
    pending: 0,
    sent: 1,
    delivered: 2,
    read: 3,
  };

  const currentRank = rank[currentStatus] ?? -1;
  const incomingRank = rank[incomingStatus] ?? -1;
  return incomingRank >= currentRank;
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
    const mappedStatus = mapWhatsAppMessageStatus(input.status.status);
    if (!mappedStatus) {
      return {
        kind: "status" as const,
        status: "ignored" as const,
        detail: `unsupported status ${input.status.status}`,
      };
    }

    const admin = createSupabaseAdminClient();
    const { data: message } = await admin
      .from("messages")
      .select("id, message_status, delivered_at, read_at")
      .eq("tenant_id", input.tenantId)
      .eq("external_message_id", input.status.id)
      .maybeSingle();

    if (!message) {
      return {
        kind: "status" as const,
        status: "ignored" as const,
        detail: "status without tracked outbound message",
      };
    }

    if (!shouldApplyStatusTransition(message.message_status, mappedStatus)) {
      return {
        kind: "status" as const,
        status: "ignored" as const,
        detail: `stale status transition ${message.message_status} -> ${mappedStatus}`,
      };
    }

    const patch: Database["public"]["Tables"]["messages"]["Update"] = {
      message_status: mappedStatus,
    };
    if (mappedStatus === "delivered" && input.status.timestamp && !message.delivered_at) {
      patch.delivered_at = new Date(
        Number(input.status.timestamp) * 1000,
      ).toISOString();
    }
    if (mappedStatus === "read" && input.status.timestamp && !message.read_at) {
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
  const parsedPayload = validateWhatsAppWebhookPayload(payload);
  if (!parsedPayload.success) {
    return {
      processed: 0,
      ignored: 1,
      duplicates: 0,
      results: [
        {
          kind: "message" as const,
          status: "ignored" as const,
          detail: "invalid payload schema",
        },
      ],
    };
  }

  const webhookPayload = parsedPayload.data;
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
