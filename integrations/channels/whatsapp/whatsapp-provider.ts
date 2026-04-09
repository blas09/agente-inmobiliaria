import type { ChannelProvider, OutboundChannelMessage } from "@/integrations/channels/types";
import { resolveWhatsAppCredentials } from "@/integrations/channels/whatsapp/credentials";

export class WhatsAppCloudProvider implements ChannelProvider {
	async sendMessage(
		input: OutboundChannelMessage,
	): Promise<{ externalMessageId?: string; rawResponse?: unknown }> {
		const metadata = input.metadata ?? {};
		const resolvedCredentials = resolveWhatsAppCredentials({
			credentialsRef:
				typeof metadata.credentialsRef === "string" ? metadata.credentialsRef : null,
			phoneNumberId:
				typeof metadata.phoneNumberId === "string" ? metadata.phoneNumberId : null,
		});

		const response = await fetch(
			`https://graph.facebook.com/${resolvedCredentials.apiVersion}/${resolvedCredentials.phoneNumberId}/messages`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${resolvedCredentials.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messaging_product: "whatsapp",
					recipient_type: "individual",
					to: input.recipientIdentifier,
					type: "text",
					text: {
						body: input.content,
					},
				}),
			},
		);

		const rawResponse = (await response.json()) as {
			messages?: Array<{ id?: string }>;
			error?: { message?: string };
		};

		if (!response.ok) {
			throw new Error(rawResponse.error?.message ?? "WhatsApp Cloud API request failed.");
		}

		return {
			externalMessageId: rawResponse.messages?.[0]?.id,
			rawResponse,
		};
	}
}
