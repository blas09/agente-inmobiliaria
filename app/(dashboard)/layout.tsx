import { AppShell } from "@/components/layout/app-shell";
import { getAppContext } from "@/server/auth/tenant-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getAppContext();

  return (
    <AppShell isPlatformAdmin={context.isPlatformAdmin}>{children}</AppShell>
  );
}
