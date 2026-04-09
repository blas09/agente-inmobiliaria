export interface RetrievalContext {
  tenantId: string;
  leadId?: string;
  propertyId?: string;
  conversationId?: string;
}

export interface StructuredAnswerInput {
  context: RetrievalContext;
  instructions: string;
  facts: Record<string, unknown>;
}

export interface AiProvider {
  summarizeConversation(input: {
    conversationId: string;
    tenantId: string;
  }): Promise<string>;
  generateStructuredAnswer(input: StructuredAnswerInput): Promise<string>;
}
