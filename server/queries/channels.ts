import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ChannelListItem {
	id: string;
	type: string;
	provider: string;
	display_name: string;
	status: string;
	connected_at: string | null;
	metadata: unknown;
	channel_whatsapp_accounts:
		| {
				phone_number_id: string | null;
				display_phone_number: string | null;
				verified_name: string | null;
				webhook_status: string;
		  }[]
		| {
				phone_number_id: string | null;
				display_phone_number: string | null;
				verified_name: string | null;
				webhook_status: string;
		  }
		| null;
}

export async function listChannels(tenantId: string): Promise<ChannelListItem[]> {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("channels")
		.select(
			"id, type, provider, display_name, status, connected_at, metadata, channel_whatsapp_accounts(phone_number_id, display_phone_number, verified_name, webhook_status)",
		)
		.eq("tenant_id", tenantId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to load channels: ${error.message}`);
	}

	return (data ?? []) as unknown as ChannelListItem[];
}
