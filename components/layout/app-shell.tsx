import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { TenantMembershipSummary } from "@/server/auth/tenant-context";

interface AppShellProps {
	activeTenantId: string | null;
	activeTenantName: string | null;
	memberships: TenantMembershipSummary[];
	isPlatformAdmin: boolean;
	userName: string;
	children: ReactNode;
}

export function AppShell({
	activeTenantId,
	activeTenantName,
	memberships,
	isPlatformAdmin,
	userName,
	children,
}: AppShellProps) {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.14),_transparent_36%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
			<div className="flex min-h-screen">
				<Sidebar isPlatformAdmin={isPlatformAdmin} />
				<div className="flex min-h-screen min-w-0 flex-1 flex-col">
					<AppHeader
						activeTenantId={activeTenantId}
						activeTenantName={activeTenantName}
						memberships={memberships}
						isPlatformAdmin={isPlatformAdmin}
						userName={userName}
					/>
					<main className="flex-1 px-6 py-8">
						<div className="mx-auto flex w-full max-w-7xl flex-col gap-6">{children}</div>
					</main>
				</div>
			</div>
		</div>
	);
}
