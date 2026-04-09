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
		<div className="min-h-screen bg-background">
			<div className="flex min-h-screen w-full">
				<Sidebar isPlatformAdmin={isPlatformAdmin} />
				<div className="flex min-h-screen min-w-0 flex-1 flex-col bg-background">
					<AppHeader
						activeTenantId={activeTenantId}
						activeTenantName={activeTenantName}
						memberships={memberships}
						isPlatformAdmin={isPlatformAdmin}
						userName={userName}
					/>
					<main className="flex-1 px-4 py-5 md:px-5 xl:px-6 xl:py-6">
						<div className="mx-auto flex w-full max-w-[88rem] flex-col gap-5">{children}</div>
					</main>
				</div>
			</div>
		</div>
	);
}
