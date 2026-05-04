import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  PaginationState,
  SortDirection,
} from "@/lib/pagination";
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

export type FaqListSort = "created" | "category" | "status";

const faqSortColumns: Record<FaqListSort, string> = {
  created: "created_at",
  category: "category",
  status: "status",
};

export async function listFaqsPaginated(
  tenantId: string,
  pagination: PaginationState,
  sorting: { sort: FaqListSort; direction: SortDirection },
): Promise<PaginatedResult<Tables<"faqs">>> {
  const supabase = await createSupabaseServerClient();
  const { data, error, count } = await supabase
    .from("faqs")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order(faqSortColumns[sorting.sort], {
      ascending: sorting.direction === "asc",
      nullsFirst: false,
    })
    .range(pagination.from, pagination.to);

  if (error) {
    throw new Error(`Failed to load paginated FAQs: ${error.message}`);
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

export async function getFaqListStats(tenantId: string) {
  const supabase = await createSupabaseServerClient();
  const [total, active] = await Promise.all([
    supabase
      .from("faqs")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    supabase
      .from("faqs")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active"),
  ]);

  if (total.error) {
    throw new Error(`Failed to count FAQs: ${total.error.message}`);
  }

  if (active.error) {
    throw new Error(`Failed to count active FAQs: ${active.error.message}`);
  }

  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
  };
}

export async function getFaqById(
  tenantId: string,
  faqId: string,
): Promise<Tables<"faqs">> {
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
