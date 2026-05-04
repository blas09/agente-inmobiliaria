import { getSidebarItems } from "@/components/layout/sidebar-items";

function flattenItemIds(
  isPlatformAdmin: boolean,
  role?: Parameters<typeof getSidebarItems>[1],
) {
  return getSidebarItems(isPlatformAdmin, role).flatMap((section) => [
    section.id,
    ...(section.children ?? []).map((item) => item.id),
  ]);
}

describe("sidebar items", () => {
  it("shows only platform navigation for platform admins without an active tenant role", () => {
    expect(flattenItemIds(true, null)).toEqual([
      "platform-heading",
      "platform-tenants",
    ]);
  });

  it("keeps tenant navigation when a platform admin has an active tenant role", () => {
    expect(flattenItemIds(true, "tenant_admin")).toEqual(
      expect.arrayContaining([
        "core-heading",
        "dashboard",
        "properties",
        "leads",
        "conversations",
        "appointments",
        "faqs",
        "channels",
        "settings",
        "platform-heading",
        "platform-tenants",
      ]),
    );
  });

  it("hides admin-only tenant items for non-admin tenant roles", () => {
    expect(flattenItemIds(false, "advisor")).not.toEqual(
      expect.arrayContaining(["channels", "settings"]),
    );
  });
});
