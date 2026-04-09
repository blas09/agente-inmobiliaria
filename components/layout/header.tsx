"use client";

import { Menu, LogOut } from "lucide-react";
import { useState } from "react";

import { signOutAction } from "@/features/auth/actions";
import { switchActiveTenantAction } from "@/features/tenants/actions";
import type { TenantMembershipSummary } from "@/server/auth/tenant-context";

import { MobileSidebarContent } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AppHeaderProps {
	activeTenantId: string | null;
	activeTenantName: string | null;
	memberships: TenantMembershipSummary[];
	isPlatformAdmin: boolean;
	userName: string;
}

export function AppHeader({
	activeTenantId,
	activeTenantName,
	memberships,
	isPlatformAdmin,
	userName,
}: AppHeaderProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
				<div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6 xl:px-8">
					<div className="flex min-w-0 items-center gap-3">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="xl:hidden"
							onClick={() => setIsOpen(true)}
						>
							<Menu className="h-5 w-5" />
						</Button>
						<div className="min-w-0">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
								{activeTenantName
									? "Workspace activo"
									: isPlatformAdmin
										? "Panel de plataforma"
										: "Workspace"}
							</p>
							<h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
								{activeTenantName ?? userName}
							</h1>
						</div>
					</div>
					<div className="hidden items-center gap-3 md:flex">
						<ThemeToggle />
						{memberships.length > 0 && activeTenantId ? (
							<form action={switchActiveTenantAction} className="min-w-[310px]">
								<NativeSelect
									defaultValue={activeTenantId}
									name="tenantId"
									onChange={(event) => event.currentTarget.form?.requestSubmit()}
								>
									{memberships.map((membership) => (
										<option key={membership.tenant.id} value={membership.tenant.id}>
											{membership.tenant.name} · {membership.role}
										</option>
									))}
								</NativeSelect>
							</form>
						) : null}
						<form action={signOutAction}>
							<Button type="submit" variant="outline">
								<LogOut className="mr-2 h-4 w-4" />
								Salir
							</Button>
						</form>
					</div>
				</div>
				<div className="space-y-3 border-t border-border px-4 py-3 md:hidden">
					<div className="flex justify-end">
						<ThemeToggle />
					</div>
					{memberships.length > 0 && activeTenantId ? (
						<form action={switchActiveTenantAction}>
							<NativeSelect
								defaultValue={activeTenantId}
								name="tenantId"
								onChange={(event) => event.currentTarget.form?.requestSubmit()}
							>
								{memberships.map((membership) => (
									<option key={membership.tenant.id} value={membership.tenant.id}>
										{membership.tenant.name} · {membership.role}
									</option>
								))}
							</NativeSelect>
						</form>
					) : null}
					<form action={signOutAction}>
						<Button type="submit" variant="outline" className="w-full">
							<LogOut className="mr-2 h-4 w-4" />
							Salir
						</Button>
					</form>
				</div>
			</header>

			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side="left" className="p-0">
					<MobileSidebarContent isPlatformAdmin={isPlatformAdmin} onNavigate={() => setIsOpen(false)} />
				</SheetContent>
			</Sheet>
		</>
	);
}
