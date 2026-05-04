import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  PaginationState,
  SortDirection,
} from "@/lib/pagination";
import type { PropertyStatus, Tables } from "@/types/database";

const propertyStatuses = new Set<PropertyStatus>([
  "draft",
  "available",
  "reserved",
  "rented",
  "sold",
  "inactive",
]);

export async function listProperties(
  tenantId: string,
  filters?: { q?: string; status?: string },
) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("properties")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (filters?.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,city.ilike.%${filters.q}%,neighborhood.ilike.%${filters.q}%`,
    );
  }

  if (
    filters?.status &&
    propertyStatuses.has(filters.status as PropertyStatus)
  ) {
    query = query.eq("status", filters.status as PropertyStatus);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load properties: ${error.message}`);
  }

  return data ?? [];
}

export type PropertyListSort =
  | "created"
  | "published"
  | "title"
  | "price"
  | "status";

const propertySortColumns: Record<PropertyListSort, string> = {
  created: "created_at",
  published: "published_at",
  title: "title",
  price: "price",
  status: "status",
};

export async function listPropertiesPaginated(
  tenantId: string,
  filters: { q?: string; status?: string },
  pagination: PaginationState,
  sorting: { sort: PropertyListSort; direction: SortDirection },
): Promise<PaginatedResult<Tables<"properties">>> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId);

  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,city.ilike.%${filters.q}%,neighborhood.ilike.%${filters.q}%`,
    );
  }

  if (
    filters.status &&
    propertyStatuses.has(filters.status as PropertyStatus)
  ) {
    query = query.eq("status", filters.status as PropertyStatus);
  }

  const { data, error, count } = await query
    .order(propertySortColumns[sorting.sort], {
      ascending: sorting.direction === "asc",
      nullsFirst: false,
    })
    .range(pagination.from, pagination.to);

  if (error) {
    throw new Error(`Failed to load paginated properties: ${error.message}`);
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

async function countProperties(
  tenantId: string,
  filters: { q?: string; status?: string },
) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,city.ilike.%${filters.q}%,neighborhood.ilike.%${filters.q}%`,
    );
  }

  if (
    filters.status &&
    propertyStatuses.has(filters.status as PropertyStatus)
  ) {
    query = query.eq("status", filters.status as PropertyStatus);
  }

  const { error, count } = await query;
  if (error) {
    throw new Error(`Failed to count properties: ${error.message}`);
  }

  return count ?? 0;
}

export async function getPropertyListStats(
  tenantId: string,
  filters: { q?: string; status?: string },
) {
  const [available, draft] = await Promise.all([
    countProperties(tenantId, { ...filters, status: "available" }),
    countProperties(tenantId, { ...filters, status: "draft" }),
  ]);

  return { available, draft };
}

export async function getPropertyById(
  tenantId: string,
  propertyId: string,
): Promise<Tables<"properties">> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", propertyId)
    .single();

  if (error) {
    throw new Error(`Failed to load property: ${error.message}`);
  }

  return data;
}

export async function getPropertyConversations(
  tenantId: string,
  propertyId: string,
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id, status, contact_display_name, contact_identifier, last_message_at, lead_id, leads(id, full_name, phone)",
    )
    .eq("tenant_id", tenantId)
    .eq("property_id", propertyId)
    .order("last_message_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load property conversations: ${error.message}`);
  }

  return (data ?? []) as unknown as Array<{
    id: string;
    status: string;
    contact_display_name: string | null;
    contact_identifier: string | null;
    last_message_at: string | null;
    lead_id: string | null;
    leads: {
      id: string;
      full_name: string;
      phone: string | null;
    } | null;
  }>;
}

export async function listAvailablePropertiesForSelection(tenantId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, external_ref, status, city, neighborhood")
    .eq("tenant_id", tenantId)
    .in("status", ["available", "reserved", "draft"])
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load selectable properties: ${error.message}`);
  }

  return data ?? [];
}
