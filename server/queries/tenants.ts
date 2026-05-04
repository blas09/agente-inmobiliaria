import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  PaginationState,
  SortDirection,
} from "@/lib/pagination";
import type { Tables, TenantRole } from "@/types/database";

export interface TenantUserSummary {
  id: string;
  role: TenantRole;
  status: string;
  user_id: string;
  user_profiles:
    | {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        avatar_url: string | null;
        created_at: string;
        updated_at: string;
      }
    | undefined;
}

export async function listAllTenants() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load tenants: ${error.message}`);
  }

  return data ?? [];
}

export type PlatformTenantListSort =
  | "created"
  | "name"
  | "slug"
  | "status"
  | "timezone";

const platformTenantSortColumns: Record<PlatformTenantListSort, string> = {
  created: "created_at",
  name: "name",
  slug: "slug",
  status: "status",
  timezone: "timezone",
};

export async function listAllTenantsPaginated(
  pagination: PaginationState,
  sorting: { sort: PlatformTenantListSort; direction: SortDirection },
): Promise<PaginatedResult<Tables<"tenants">>> {
  const supabase = await createSupabaseServerClient();
  const { data, error, count } = await supabase
    .from("tenants")
    .select("*", { count: "exact" })
    .order(platformTenantSortColumns[sorting.sort], {
      ascending: sorting.direction === "asc",
      nullsFirst: false,
    })
    .range(pagination.from, pagination.to);

  if (error) {
    throw new Error(`Failed to load paginated tenants: ${error.message}`);
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

export async function getTenantById(
  tenantId: string,
): Promise<Tables<"tenants">> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();

  if (error) {
    throw new Error(`Failed to load tenant: ${error.message}`);
  }

  return data;
}

export async function getPlatformSummary() {
  const supabase = await createSupabaseServerClient();
  const [tenants, activeTenants, memberships] = await Promise.all([
    supabase.from("tenants").select("*", { head: true, count: "exact" }),
    supabase
      .from("tenants")
      .select("*", { head: true, count: "exact" })
      .eq("status", "active"),
    supabase
      .from("tenant_users")
      .select("*", { head: true, count: "exact" })
      .eq("status", "active"),
  ]);

  return {
    totalTenants: tenants.count ?? 0,
    activeTenants: activeTenants.count ?? 0,
    activeMemberships: memberships.count ?? 0,
  };
}

export async function getTenantUsers(tenantId: string, includeInactive = true) {
  const supabase = await createSupabaseServerClient();
  let membershipsQuery = supabase
    .from("tenant_users")
    .select("id, role, status, user_id")
    .eq("tenant_id", tenantId)
    .order("created_at");

  if (!includeInactive) {
    membershipsQuery = membershipsQuery.eq("status", "active");
  }

  const { data: memberships, error } = await membershipsQuery;

  if (error) {
    throw new Error(`Failed to load tenant users: ${error.message}`);
  }

  const userIds = (memberships ?? []).map((membership) => membership.user_id);

  if (userIds.length === 0) {
    return [];
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("user_profiles")
    .select("*")
    .in("id", userIds);

  if (profilesError) {
    throw new Error(`Failed to load user profiles: ${profilesError.message}`);
  }

  const profilesMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  return (memberships ?? []).map((membership) => ({
    id: membership.id,
    role: membership.role,
    status: membership.status,
    user_id: membership.user_id,
    user_profiles: profilesMap.get(membership.user_id),
  })) as TenantUserSummary[];
}

export async function getUserProfileByEmail(email: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .ilike("email", email)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load user profile by email: ${error.message}`);
  }

  return data;
}

export async function getAssignableTenantUsers(tenantId: string) {
  const users = await getTenantUsers(tenantId, false);

  return users.filter(
    (user) =>
      user.status === "active" &&
      ["tenant_owner", "tenant_admin", "advisor", "operator"].includes(
        user.role,
      ),
  );
}
