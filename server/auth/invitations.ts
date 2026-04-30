import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServiceRoleEnv } from "@/lib/env";

export async function activateAcceptedTenantInvitations(userId: string) {
  if (!hasSupabaseServiceRoleEnv()) {
    return 0;
  }

  const admin = createSupabaseAdminClient();
  const { data: invitedMemberships, error: lookupError } = await admin
    .from("tenant_users")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "invited");

  if (lookupError) {
    throw new Error(
      `Failed to load invited tenant memberships: ${lookupError.message}`,
    );
  }

  if (!invitedMemberships || invitedMemberships.length === 0) {
    return 0;
  }

  const { error: updateError } = await admin
    .from("tenant_users")
    .update({ status: "active" })
    .eq("user_id", userId)
    .eq("status", "invited");

  if (updateError) {
    throw new Error(
      `Failed to activate invited tenant memberships: ${updateError.message}`,
    );
  }

  return invitedMemberships.length;
}
