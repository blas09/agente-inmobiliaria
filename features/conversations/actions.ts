"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toBoolean, toNullableString } from "@/lib/utils";
import { requireConversationOperateContext } from "@/server/auth/tenant-context";
import { getAssignableTenantUsers } from "@/server/queries/tenants";
import { sendManualConversationReply } from "@/server/services/conversation-messaging";
import { listWhatsAppTemplates } from "@/server/queries/whatsapp-templates";
import type { ActionState } from "@/types/actions";
import type { ConversationStatus, Json } from "@/types/database";
import { WhatsAppCloudProvider } from "@/integrations/channels/whatsapp/whatsapp-provider";
import { parseWhatsAppTemplateComponents } from "@/features/whatsapp-templates/schema";

const conversationStatuses = new Set([
  "open",
  "pending_human",
  "automated",
  "closed",
]);

async function ensureAssignableConversationUser(
  tenantId: string,
  userId: string | null,
) {
  if (!userId) return true;

  const assignableUsers = await getAssignableTenantUsers(tenantId);
  return assignableUsers.some((user) => user.user_id === userId);
}

export async function updateConversationRoutingAction(
  conversationId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireConversationOperateContext();
  const supabase = await createSupabaseServerClient();
  const assignedTo = toNullableString(formData.get("assigned_to"));
  const status = formData.get("status")?.toString() ?? "open";
  const handoffReason = toNullableString(formData.get("handoff_reason"));
  const aiEnabled = toBoolean(formData.get("ai_enabled"));

  if (!conversationStatuses.has(status)) {
    return {
      status: "error",
      message: "El estado de conversación seleccionado no es válido.",
    };
  }

  if (!(await ensureAssignableConversationUser(activeTenant.id, assignedTo))) {
    return {
      status: "error",
      message:
        "El asesor seleccionado no pertenece al tenant o no puede recibir asignaciones.",
    };
  }

  const closedAt = status === "closed" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("conversations")
    .update({
      assigned_to: assignedTo,
      status: status as ConversationStatus,
      handoff_reason: handoffReason,
      ai_enabled: aiEnabled,
      closed_at: closedAt,
    })
    .eq("tenant_id", activeTenant.id)
    .eq("id", conversationId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/conversations");
  revalidatePath(`/dashboard/conversations/${conversationId}`);

  return {
    status: "success",
    message: "Routing conversacional actualizado.",
  };
}

export async function sendConversationReplyAction(
  conversationId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant, user } = await requireConversationOperateContext();
  const content = formData.get("content")?.toString() ?? "";
  const templateId = formData.get("template_id")?.toString();
  const templateComponentsRaw = formData
    .get("template_components")
    ?.toString();

  if (!content.trim() && !templateId) {
    return {
      status: "error",
      message: "Escribí un mensaje antes de enviarlo.",
    };
  }

  try {
    let metadata: Json | undefined;
    let templateName: string | null = null;
    let contentType: "text" | "template" = "text";

    if (templateId) {
      const templates = await listWhatsAppTemplates(activeTenant.id);
      const template = templates.find((item) => item.id === templateId);

      if (!template) {
        return {
          status: "error",
          message: "El template seleccionado no existe.",
        };
      }

      if (!template.is_active || template.status !== "approved") {
        return {
          status: "error",
          message: "El template debe estar activo y aprobado.",
        };
      }

      let templateComponents: Json = template.components ?? [];
      if (templateComponentsRaw && templateComponentsRaw.trim().length > 0) {
        try {
          const parsed = JSON.parse(templateComponentsRaw);
          const componentsResult = parseWhatsAppTemplateComponents(parsed);
          if (!componentsResult.success) {
            return {
              status: "error",
              message: componentsResult.error.issues
                .map((issue) =>
                  issue.path.length > 0
                    ? `${issue.path.join(".")}: ${issue.message}`
                    : issue.message,
                )
                .join(" | "),
            };
          }
          templateComponents = toJson(componentsResult.data);
        } catch {
          return {
            status: "error",
            message:
              "Los componentes del template deben ser un JSON válido (array).",
          };
        }
      }

      templateName = template.name;
      metadata = toJson({
        templateName: template.name,
        templateLanguage: template.language,
        templateComponents,
        templateId: template.id,
      });
      contentType = "template";
    }

    await sendManualConversationReply({
      tenantId: activeTenant.id,
      conversationId,
      userId: user.id,
      content:
        contentType === "template"
          ? `Template: ${templateName ?? ""}`
          : content,
      contentType,
      metadata,
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "No se pudo enviar el mensaje.",
    };
  }

  revalidatePath("/dashboard/conversations");
  revalidatePath(`/dashboard/conversations/${conversationId}`);

  return {
    status: "success",
    message: "Mensaje enviado por WhatsApp.",
  };
}

export async function updateConversationLinksAction(
  conversationId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { activeTenant } = await requireConversationOperateContext();
  const supabase = await createSupabaseServerClient();
  const leadId = toNullableString(formData.get("lead_id"));
  const propertyId = toNullableString(formData.get("property_id"));

  if (leadId) {
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id")
      .eq("tenant_id", activeTenant.id)
      .eq("id", leadId)
      .maybeSingle();

    if (leadError || !lead) {
      return {
        status: "error",
        message:
          leadError?.message ??
          "El lead seleccionado no existe en este tenant.",
      };
    }
  }

  if (propertyId) {
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("tenant_id", activeTenant.id)
      .eq("id", propertyId)
      .maybeSingle();

    if (propertyError || !property) {
      return {
        status: "error",
        message:
          propertyError?.message ??
          "La propiedad seleccionada no existe en este tenant.",
      };
    }
  }

  const { error } = await supabase
    .from("conversations")
    .update({
      lead_id: leadId,
      property_id: propertyId,
    })
    .eq("tenant_id", activeTenant.id)
    .eq("id", conversationId);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/dashboard/conversations");
  revalidatePath(`/dashboard/conversations/${conversationId}`);

  return {
    status: "success",
    message: "Vínculos de conversación actualizados.",
  };
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? {})) as Json;
}

function asRecord(value: Json | null | undefined): Record<string, unknown> {
  if (!value) return {};
  if (typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

export async function retryConversationMessageAction(formData: FormData) {
  const { activeTenant } = await requireConversationOperateContext();
  const supabase = await createSupabaseServerClient();
  const messageId = formData.get("message_id")?.toString();

  if (!messageId) {
    throw new Error("Falta el mensaje a reintentar.");
  }

  const { data: rawMessage, error: messageError } = await supabase
    .from("messages")
    .select(
      "id, content, content_type, message_status, raw_payload, conversation_id, conversations!inner(channel_id, contact_identifier, channels(type, provider, credentials_ref))",
    )
    .eq("tenant_id", activeTenant.id)
    .eq("id", messageId)
    .single();

  type RetryMessage = {
    id: string;
    content: string | null;
    content_type: string | null;
    message_status: string | null;
    raw_payload: Json | null;
    conversation_id: string;
    conversations: {
      channel_id: string;
      contact_identifier: string | null;
      channels: {
        type: string;
        provider: string | null;
        credentials_ref: string | null;
      } | null;
    };
  };

  const message = rawMessage as unknown as RetryMessage | null;

  if (messageError || !message) {
    throw new Error(messageError?.message ?? "No se encontró el mensaje.");
  }

  if (message.message_status !== "failed") {
    throw new Error("Solo podés reintentar mensajes fallidos.");
  }

  const conversation = (message.conversations ?? null) as {
    channel_id: string;
    contact_identifier: string | null;
    channels: {
      type: string;
      provider: string | null;
      credentials_ref: string | null;
    } | null;
  };

  if (conversation.channels?.type !== "whatsapp") {
    throw new Error("Reintentos disponibles solo para WhatsApp.");
  }

  if (!conversation.contact_identifier) {
    throw new Error("La conversación no tiene identificador de contacto.");
  }

  const { data: whatsappAccount, error: whatsappAccountError } = await supabase
    .from("channel_whatsapp_accounts")
    .select("phone_number_id")
    .eq("tenant_id", activeTenant.id)
    .eq("channel_id", conversation.channel_id)
    .maybeSingle();

  if (whatsappAccountError) {
    throw new Error(whatsappAccountError.message);
  }

  const rawPayload = asRecord(message.raw_payload as Json | null);
  const metadata: Json = toJson(rawPayload);
  const metadataRecord = asRecord(metadata);

  try {
    const provider = new WhatsAppCloudProvider();
    const sendResult = await provider.sendMessage({
      messageId: message.id,
      channelId: conversation.channel_id,
      conversationId: message.conversation_id,
      recipientIdentifier: conversation.contact_identifier,
      content: message.content ?? "",
      metadata: {
        credentialsRef:
          typeof conversation.channels?.credentials_ref === "string"
            ? conversation.channels.credentials_ref
            : null,
        phoneNumberId: whatsappAccount?.phone_number_id ?? null,
        ...metadataRecord,
      },
    });

    const sentAt = new Date().toISOString();
    await supabase.from("channel_events").insert({
      tenant_id: activeTenant.id,
      channel_id: conversation.channel_id,
      provider: "meta_whatsapp_cloud",
      event_type: "whatsapp.message.outbound.retry",
      direction: "outbound",
      external_event_id: sendResult.externalMessageId ?? null,
      payload: {
        message_id: message.id,
        conversation_id: message.conversation_id,
        response: sendResult.rawResponse ?? null,
      } as Json,
      processing_status: "processed",
      processed_at: sentAt,
    });

    const { error: updateError } = await supabase
      .from("messages")
      .update({
        external_message_id: sendResult.externalMessageId ?? null,
        message_status: "sent",
        sent_at: sentAt,
        error_message: null,
        raw_payload: toJson({
          ...rawPayload,
          provider_response: sendResult.rawResponse ?? null,
        }),
      })
      .eq("tenant_id", activeTenant.id)
      .eq("id", message.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    await supabase
      .from("conversations")
      .update({
        last_message_at: sentAt,
        status: "open",
        closed_at: null,
      })
      .eq("tenant_id", activeTenant.id)
      .eq("id", message.conversation_id);

    revalidatePath("/dashboard/conversations");
    revalidatePath(`/dashboard/conversations/${message.conversation_id}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "No se pudo reenviar el mensaje.";

    await supabase.from("channel_events").insert({
      tenant_id: activeTenant.id,
      channel_id: conversation.channel_id,
      provider: "meta_whatsapp_cloud",
      event_type: "whatsapp.message.outbound.retry.failed",
      direction: "outbound",
      external_event_id: null,
      payload: {
        message_id: message.id,
        conversation_id: message.conversation_id,
        error: errorMessage,
      } as Json,
      processing_status: "failed",
      error_message: errorMessage,
      processed_at: new Date().toISOString(),
    });

    await supabase
      .from("messages")
      .update({
        message_status: "failed",
        error_message: errorMessage,
      })
      .eq("tenant_id", activeTenant.id)
      .eq("id", message.id);
    throw new Error(errorMessage);
  }
}
