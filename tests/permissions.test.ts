import {
  canCreateBusinessRecords,
  canDeleteLeads,
  canDeleteProperties,
  canManageFaqs,
  canManageAppointments,
  canManageChannels,
  canManageLeads,
  canManageProperties,
  canManageTenant,
  canOperateConversations,
  canViewSettings,
} from "@/lib/permissions";
import type { TenantRole } from "@/types/database";

const roles: TenantRole[] = [
  "tenant_owner",
  "tenant_admin",
  "advisor",
  "operator",
  "viewer",
];

describe("tenant permissions", () => {
  it("limits tenant management to owners and admins", () => {
    expect(roles.filter(canManageTenant)).toEqual([
      "tenant_owner",
      "tenant_admin",
    ]);
    expect(roles.filter(canManageChannels)).toEqual([
      "tenant_owner",
      "tenant_admin",
    ]);
    expect(roles.filter(canViewSettings)).toEqual([
      "tenant_owner",
      "tenant_admin",
    ]);
  });

  it("allows operational writes for owner, admin, advisor, and operator roles", () => {
    const operationalRoles = [
      "tenant_owner",
      "tenant_admin",
      "advisor",
      "operator",
    ];

    expect(roles.filter(canCreateBusinessRecords)).toEqual(operationalRoles);
    expect(roles.filter(canManageProperties)).toEqual(operationalRoles);
    expect(roles.filter(canManageLeads)).toEqual(operationalRoles);
    expect(roles.filter(canManageAppointments)).toEqual(operationalRoles);
    expect(roles.filter(canOperateConversations)).toEqual(operationalRoles);
  });

  it("limits destructive lead and property operations to owners and admins", () => {
    expect(roles.filter(canDeleteProperties)).toEqual([
      "tenant_owner",
      "tenant_admin",
    ]);
    expect(roles.filter(canDeleteLeads)).toEqual([
      "tenant_owner",
      "tenant_admin",
    ]);
  });

  it("allows operators to manage FAQs without granting tenant settings access", () => {
    expect(roles.filter(canManageFaqs)).toEqual([
      "tenant_owner",
      "tenant_admin",
      "operator",
    ]);
  });
});
