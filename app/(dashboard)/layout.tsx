import { AppShell } from "@/components/layout/app-shell";
import { getAppContext } from "@/server/auth/tenant-context";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const context = await getAppContext();

	return (
		<AppShell
			activeTenantId={context.activeTenant?.id ?? null}
			activeTenantName={context.activeTenant?.name ?? null}
			memberships={context.memberships}
			isPlatformAdmin={context.isPlatformAdmin}
			userName={context.user.user_metadata.full_name ?? context.user.email ?? "Usuario"}
		>
			{children}
		</AppShell>
	);
}
