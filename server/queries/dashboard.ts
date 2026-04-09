import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDashboardSummary(tenantId: string) {
	const supabase = await createSupabaseServerClient();

	const [properties, leads, conversations, sources, recentLeads, recentConversations] =
		await Promise.all([
			supabase
				.from("properties")
				.select("*", { head: true, count: "exact" })
				.eq("tenant_id", tenantId)
				.eq("status", "available"),
			supabase.from("leads").select("*", { head: true, count: "exact" }).eq("tenant_id", tenantId),
			supabase
				.from("conversations")
				.select("*", { head: true, count: "exact" })
				.eq("tenant_id", tenantId)
				.neq("status", "closed"),
			supabase.from("leads").select("source").eq("tenant_id", tenantId),
			supabase
				.from("leads")
				.select("id, full_name, source, qualification_status, created_at")
				.eq("tenant_id", tenantId)
				.order("created_at", { ascending: false })
				.limit(5),
			supabase
				.from("conversations")
				.select("id, status, contact_display_name, last_message_at")
				.eq("tenant_id", tenantId)
				.order("last_message_at", { ascending: false })
				.limit(5),
		]);

	const leadsBySource = new Map<string, number>();
	for (const row of sources.data ?? []) {
		const key = row.source ?? "sin fuente";
		leadsBySource.set(key, (leadsBySource.get(key) ?? 0) + 1);
	}

	return {
		metrics: {
			activeProperties: properties.count ?? 0,
			leads: leads.count ?? 0,
			openConversations: conversations.count ?? 0,
		},
		leadsBySource: Array.from(leadsBySource.entries()).map(([source, total]) => ({
			source,
			total,
		})),
		recentLeads: recentLeads.data ?? [],
		recentConversations: recentConversations.data ?? [],
	};
}

