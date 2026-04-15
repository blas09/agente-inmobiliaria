import type { TenantRole } from "@/types/database";

export function canManageTenant(role: TenantRole | null | undefined) {
  return role === "tenant_owner" || role === "tenant_admin";
}

export function canManageChannels(role: TenantRole | null | undefined) {
  return canManageTenant(role);
}

export function canCreateBusinessRecords(role: TenantRole | null | undefined) {
  return (
    role === "tenant_owner" ||
    role === "tenant_admin" ||
    role === "advisor" ||
    role === "operator"
  );
}

export function canManageAppointments(role: TenantRole | null | undefined) {
  return canCreateBusinessRecords(role);
}

export function canOperateConversations(role: TenantRole | null | undefined) {
  return canCreateBusinessRecords(role);
}

export function canViewSettings(role: TenantRole | null | undefined) {
  return canManageTenant(role);
}
