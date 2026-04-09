import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export async function listFaqs(tenantId: string) {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("faqs")
		.select("*")
		.eq("tenant_id", tenantId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to load FAQs: ${error.message}`);
	}

	return data ?? [];
}

export async function getFaqById(tenantId: string, faqId: string): Promise<Tables<"faqs">> {
	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase
		.from("faqs")
		.select("*")
		.eq("tenant_id", tenantId)
		.eq("id", faqId)
		.single();

	if (error) {
		throw new Error(`Failed to load FAQ: ${error.message}`);
	}

	return data;
}
