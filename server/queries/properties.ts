import { createSupabaseServerClient } from "@/lib/supabase/server";
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
