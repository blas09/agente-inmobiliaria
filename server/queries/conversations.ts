import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ConversationListItem {
	id: string;
	channel_id?: string;
	status: string;
	contact_display_name: string | null;
	contact_identifier: string | null;
	last_message_at: string | null;
	ai_enabled: boolean;
	lead_id: string | null;
	property_id: string | null;
	channels: {
		display_name: string;
		type: string;
		provider?: string | null;
		credentials_ref?: string | null;
	} | null;
}

export interface ConversationDetail extends ConversationListItem {
	handoff_reason: string | null;
	assigned_to: string | null;
	closed_at?: string | null;
}

export async function listConversations(tenantId: string): Promise<ConversationListItem[]> {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("conversations")
		.select(
			"id, channel_id, status, contact_display_name, contact_identifier, last_message_at, ai_enabled, lead_id, property_id, channels(display_name, type, provider, credentials_ref)",
		)
		.eq("tenant_id", tenantId)
		.order("last_message_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to load conversations: ${error.message}`);
	}

	return (data ?? []) as unknown as ConversationListItem[];
}

export async function getConversationDetail(tenantId: string, conversationId: string) {
	const supabase = await createSupabaseServerClient();
	const { data: conversation, error: conversationError } = await supabase
		.from("conversations")
		.select(
			"id, channel_id, status, contact_display_name, contact_identifier, handoff_reason, last_message_at, closed_at, ai_enabled, lead_id, property_id, assigned_to, channels(display_name, type, provider, credentials_ref)",
		)
		.eq("tenant_id", tenantId)
		.eq("id", conversationId)
		.single();

	if (conversationError) {
		throw new Error(`Failed to load conversation: ${conversationError.message}`);
	}

	const { data: messages, error: messagesError } = await supabase
		.from("messages")
		.select("*")
		.eq("tenant_id", tenantId)
		.eq("conversation_id", conversationId)
		.order("created_at", { ascending: true });

	if (messagesError) {
		throw new Error(`Failed to load messages: ${messagesError.message}`);
	}

	return {
		conversation: conversation as unknown as ConversationDetail,
		messages: messages ?? [],
	};
}
