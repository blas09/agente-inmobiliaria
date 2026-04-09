import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WhatsAppCloudProvider } from "@/integrations/channels/whatsapp/whatsapp-provider";
import type { Json } from "@/types/database";

interface OutboundConversationRecord {
  id: string;
  tenant_id: string;
  channel_id: string;
  contact_identifier: string | null;
  channels: {
    type: string;
    provider: string | null;
    credentials_ref: string | null;
  } | null;
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? {})) as Json;
}

export async function sendManualConversationReply(input: {
  tenantId: string;
  conversationId: string;
  userId: string;
  content: string;
}) {
  const supabase = await createSupabaseServerClient();
  const normalizedContent = input.content.trim();

  if (!normalizedContent) {
    throw new Error("Message content cannot be empty.");
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select(
      "id, tenant_id, channel_id, contact_identifier, channels(type, provider, credentials_ref)",
    )
    .eq("tenant_id", input.tenantId)
    .eq("id", input.conversationId)
    .single();
  const resolvedConversation =
    conversation as unknown as OutboundConversationRecord | null;

  if (conversationError || !resolvedConversation) {
    throw new Error(conversationError?.message ?? "Conversation not found.");
  }

  if (resolvedConversation.channels?.type !== "whatsapp") {
    throw new Error(
      "Manual outbound is only implemented for WhatsApp channels.",
    );
  }

  if (!resolvedConversation.contact_identifier) {
    throw new Error("Conversation does not have a contact identifier.");
  }

  const { data: whatsappAccount, error: whatsappAccountError } = await supabase
    .from("channel_whatsapp_accounts")
    .select("phone_number_id")
    .eq("tenant_id", input.tenantId)
    .eq("channel_id", resolvedConversation.channel_id)
    .maybeSingle();

  if (whatsappAccountError) {
    throw new Error(
      `Failed to resolve WhatsApp account: ${whatsappAccountError.message}`,
    );
  }

  const pendingInsert = await supabase
    .from("messages")
    .insert({
      tenant_id: input.tenantId,
      conversation_id: input.conversationId,
      sender_type: "advisor",
      direction: "outbound",
      content: normalizedContent,
      content_type: "text",
      message_status: "pending",
      raw_payload: {
        origin: "dashboard.manual_reply",
        user_id: input.userId,
      },
    })
    .select("id")
    .single();

  if (pendingInsert.error || !pendingInsert.data) {
    throw new Error(
      pendingInsert.error?.message ??
        "Failed to create pending outbound message.",
    );
  }

  const messageId = pendingInsert.data.id;

  try {
    const provider = new WhatsAppCloudProvider();
    const sendResult = await provider.sendMessage({
      messageId,
      channelId: resolvedConversation.channel_id,
      conversationId: input.conversationId,
      recipientIdentifier: resolvedConversation.contact_identifier,
      content: normalizedContent,
      metadata: {
        credentialsRef:
          typeof resolvedConversation.channels?.credentials_ref === "string"
            ? resolvedConversation.channels.credentials_ref
            : null,
        phoneNumberId: whatsappAccount?.phone_number_id ?? null,
      },
    });

    const sentAt = new Date().toISOString();
    const updateMessage = await supabase
      .from("messages")
      .update({
        external_message_id: sendResult.externalMessageId ?? null,
        message_status: "sent",
        sent_at: sentAt,
        error_message: null,
        raw_payload: {
          origin: "dashboard.manual_reply",
          user_id: input.userId,
          provider_response: toJson(sendResult.rawResponse),
        } as Json,
      })
      .eq("tenant_id", input.tenantId)
      .eq("id", messageId);

    if (updateMessage.error) {
      throw new Error(updateMessage.error.message);
    }

    await supabase
      .from("conversations")
      .update({
        last_message_at: sentAt,
        status: "open",
        closed_at: null,
      })
      .eq("tenant_id", input.tenantId)
      .eq("id", input.conversationId);

    return {
      messageId,
      externalMessageId: sendResult.externalMessageId ?? null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Outbound WhatsApp failed.";

    await supabase
      .from("messages")
      .update({
        message_status: "failed",
        error_message: errorMessage,
      })
      .eq("tenant_id", input.tenantId)
      .eq("id", messageId);

    throw error;
  }
}
