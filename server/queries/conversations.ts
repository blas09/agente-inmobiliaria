import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  PaginationState,
  SortDirection,
} from "@/lib/pagination";
import type { ConversationStatus } from "@/types/database";

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

export async function listConversations(
  tenantId: string,
): Promise<ConversationListItem[]> {
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

export type ConversationListSort = "last_message" | "status" | "contact";

const conversationSortColumns: Record<ConversationListSort, string> = {
  last_message: "last_message_at",
  status: "status",
  contact: "contact_display_name",
};

export async function listConversationsPaginated(
  tenantId: string,
  pagination: PaginationState,
  sorting: { sort: ConversationListSort; direction: SortDirection },
): Promise<PaginatedResult<ConversationListItem>> {
  const supabase = await createSupabaseServerClient();
  const { data, error, count } = await supabase
    .from("conversations")
    .select(
      "id, channel_id, status, contact_display_name, contact_identifier, last_message_at, ai_enabled, lead_id, property_id, channels(display_name, type, provider, credentials_ref)",
      { count: "exact" },
    )
    .eq("tenant_id", tenantId)
    .order(conversationSortColumns[sorting.sort], {
      ascending: sorting.direction === "asc",
      nullsFirst: false,
    })
    .range(pagination.from, pagination.to);

  if (error) {
    throw new Error(`Failed to load paginated conversations: ${error.message}`);
  }

  return {
    items: (data ?? []) as unknown as ConversationListItem[],
    total: count ?? 0,
  };
}

async function countConversations(
  tenantId: string,
  filters?: { status?: string; aiEnabled?: boolean },
) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  if (filters?.status) {
    query = query.eq("status", filters.status as ConversationStatus);
  }

  if (typeof filters?.aiEnabled === "boolean") {
    query = query.eq("ai_enabled", filters.aiEnabled);
  }

  const { error, count } = await query;
  if (error) {
    throw new Error(`Failed to count conversations: ${error.message}`);
  }

  return count ?? 0;
}

export async function getConversationListStats(tenantId: string) {
  const [open, handoff, aiEnabled] = await Promise.all([
    countConversations(tenantId, { status: "open" }),
    countConversations(tenantId, { status: "pending_human" }),
    countConversations(tenantId, { aiEnabled: true }),
  ]);

  return { open, handoff, aiEnabled };
}

export async function getConversationDetail(
  tenantId: string,
  conversationId: string,
) {
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
    throw new Error(
      `Failed to load conversation: ${conversationError.message}`,
    );
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
