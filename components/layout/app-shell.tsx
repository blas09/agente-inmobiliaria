import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { TenantRole } from "@/types/database";

interface AppShellProps {
	isPlatformAdmin: boolean;
	activeRole: TenantRole | null | undefined;
	children: ReactNode;
}

export function AppShell({
	isPlatformAdmin,
	activeRole,
	children,
}: AppShellProps) {
	return (
		<div className="flex min-h-screen w-full">
			<div className="page-wrapper flex w-full">
				<div className="hidden xl:block">
					<Sidebar activeRole={activeRole} isPlatformAdmin={isPlatformAdmin} />
				</div>
				<div className="body-wrapper w-full bg-background">
					<AppHeader activeRole={activeRole} isPlatformAdmin={isPlatformAdmin} />
					<div className="container mx-auto px-6 py-30">{children}</div>
				</div>
			</div>
		</div>
	);
}
