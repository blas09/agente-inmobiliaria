import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface AppShellProps {
	isPlatformAdmin: boolean;
	children: ReactNode;
}

export function AppShell({ isPlatformAdmin, children }: AppShellProps) {
	return (
		<div className="flex min-h-screen w-full">
			<div className="page-wrapper flex w-full">
				<div className="hidden xl:block">
					<Sidebar isPlatformAdmin={isPlatformAdmin} />
				</div>
				<div className="body-wrapper w-full bg-background">
					<AppHeader isPlatformAdmin={isPlatformAdmin} />
					<div className="container mx-auto px-6 py-30">{children}</div>
				</div>
			</div>
		</div>
	);
}
