"use client";

import { LogOut } from "lucide-react";

import { signOutAction } from "@/features/auth/actions";
import { switchActiveTenantAction } from "@/features/tenants/actions";
import type { TenantMembershipSummary } from "@/server/auth/tenant-context";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

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
	return (
		<header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
			<div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
						{activeTenantName ? "Workspace activo" : isPlatformAdmin ? "Panel de plataforma" : "Workspace"}
					</p>
					<h1 className="text-xl font-semibold tracking-tight text-slate-950">
						{activeTenantName ?? userName}
					</h1>
				</div>
				<div className="flex flex-col gap-3 md:flex-row md:items-center">
					{memberships.length > 0 && activeTenantId ? (
						<form action={switchActiveTenantAction} className="min-w-[260px]">
							<Select
								defaultValue={activeTenantId}
								name="tenantId"
								onChange={(event) => event.currentTarget.form?.requestSubmit()}
							>
								{memberships.map((membership) => (
									<option key={membership.tenant.id} value={membership.tenant.id}>
										{membership.tenant.name} · {membership.role}
									</option>
								))}
							</Select>
						</form>
					) : null}
					<form action={signOutAction}>
						<Button type="submit" variant="outline" className="w-full md:w-auto">
							<LogOut className="mr-2 h-4 w-4" />
							Salir
						</Button>
					</form>
				</div>
			</div>
		</header>
	);
}
