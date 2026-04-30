import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ACTIVE_TENANT_COOKIE } from "@/server/auth/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  canDeleteLeads,
  canDeleteProperties,
  canManageAppointments,
  canManageFaqs,
  canManageLeads,
  canManageProperties,
  canManageTenant,
  canOperateConversations,
} from "@/lib/permissions";
import { activateAcceptedTenantInvitations } from "@/server/auth/invitations";
import type { Tables, TenantRole } from "@/types/database";

interface TenantMembershipRecord {
  id: string;
  tenant_id: string;
  user_id: string;
  role: TenantRole;
  status: string;
  tenants: Tables<"tenants">;
}

export interface TenantMembershipSummary {
  id: string;
  tenantId: string;
  role: TenantRole;
  tenant: Tables<"tenants">;
}

export interface AppContext {
  user: Awaited<ReturnType<typeof requireUser>>;
  memberships: TenantMembershipSummary[];
  isPlatformAdmin: boolean;
  activeMembership: TenantMembershipSummary | null;
  activeTenant: Tables<"tenants"> | null;
}

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getTenantMemberships(): Promise<
  TenantMembershipSummary[]
> {
  const user = await requireUser();
  await activateAcceptedTenantInvitations(user.id);

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tenant_users")
    .select(
      "id, tenant_id, user_id, role, status, tenants(id, name, slug, status, primary_currency, timezone, locale, settings, branding, created_at, updated_at)",
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load tenant memberships: ${error.message}`);
  }

  return ((data ?? []) as unknown as TenantMembershipRecord[]).map(
    (membership) => ({
      id: membership.id,
      tenantId: membership.tenant_id,
      role: membership.role,
      tenant: membership.tenants,
    }),
  );
}

export async function getAppContext(): Promise<AppContext> {
  const user = await requireUser();
  const memberships = await getTenantMemberships();
  const supabase = await createSupabaseServerClient();
  const { data: platformRoles, error: platformRoleError } = await supabase
    .from("platform_users")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "platform_admin")
    .eq("status", "active")
    .limit(1);

  if (platformRoleError) {
    throw new Error(
      `Failed to resolve platform role: ${platformRoleError.message}`,
    );
  }

  const isPlatformAdmin = (platformRoles ?? []).length > 0;

  const cookieStore = await cookies();
  const activeTenantCookie = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value;
  const activeMembership =
    memberships.find(
      (membership) => membership.tenant.id === activeTenantCookie,
    ) ??
    memberships[0] ??
    null;

  return {
    user,
    memberships,
    isPlatformAdmin,
    activeMembership,
    activeTenant: activeMembership?.tenant ?? null,
  };
}

export async function getActiveTenantContext() {
  const context = await getAppContext();

  if (!context.activeTenant || !context.activeMembership) {
    if (context.isPlatformAdmin) {
      redirect("/dashboard/platform/tenants");
    }

    throw new Error("The authenticated user does not belong to any tenant.");
  }

  return {
    ...context,
    activeTenant: context.activeTenant,
    activeMembership: context.activeMembership,
  };
}

export async function requirePlatformAdmin() {
  const context = await getAppContext();

  if (!context.isPlatformAdmin) {
    redirect("/dashboard");
  }

  return context;
}

export async function requireTenantAdminContext() {
  const context = await getActiveTenantContext();

  if (!canManageTenant(context.activeMembership.role)) {
    redirect("/dashboard");
  }

  return context;
}

export async function requirePropertyWriteContext() {
  const context = await getActiveTenantContext();

  if (!canManageProperties(context.activeMembership.role)) {
    redirect("/dashboard");
  }

  return context;
}

export async function requirePropertyDeleteContext() {
  const context = await getActiveTenantContext();

  if (!canDeleteProperties(context.activeMembership.role)) {
    redirect("/dashboard");
  }

  return context;
}

export async function requireLeadWriteContext() {
  const context = await getActiveTenantContext();

  if (!canManageLeads(context.activeMembership.role)) {
    redirect("/dashboard");
  }

  return context;
}

export async function requireLeadDeleteContext() {
  const context = await getActiveTenantContext();

  if (!canDeleteLeads(context.activeMembership.role)) {
    redirect("/dashboard");
  }

  return context;
}

export async function requireAppointmentWriteContext() {
  const context = await getActiveTenantContext();

  if (!canManageAppointments(context.activeMembership.role)) {
    redirect("/dashboard");
  }

  return context;
}

export async function requireConversationOperateContext() {
  const context = await getActiveTenantContext();

  if (!canOperateConversations(context.activeMembership.role)) {
    redirect("/dashboard");
  }

  return context;
}

export async function requireFaqManageContext() {
  const context = await getActiveTenantContext();

  if (!canManageFaqs(context.activeMembership.role)) {
    redirect("/dashboard");
  }

  return context;
}
