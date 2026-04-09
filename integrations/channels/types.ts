export interface InboundChannelMessage {
  channelExternalId: string;
  tenantHint?: string;
  contactIdentifier: string;
  contactDisplayName?: string;
  content: string;
  rawPayload: unknown;
  receivedAt: string;
}

export interface OutboundChannelMessage {
  messageId?: string;
  channelId: string;
  conversationId: string;
  recipientIdentifier: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ChannelProvider {
  sendMessage(input: OutboundChannelMessage): Promise<{
    externalMessageId?: string;
    rawResponse?: unknown;
  }>;
}
