"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Home,
	Building2,
	Users,
	MessagesSquare,
	CalendarDays,
	CircleHelp,
	PlugZap,
	Settings,
	Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
	{ href: "/dashboard", label: "Resumen", icon: Home },
	{ href: "/dashboard/properties", label: "Propiedades", icon: Building2 },
	{ href: "/dashboard/leads", label: "Leads", icon: Users },
	{ href: "/dashboard/conversations", label: "Conversaciones", icon: MessagesSquare },
	{ href: "/dashboard/appointments", label: "Agenda", icon: CalendarDays },
	{ href: "/dashboard/faqs", label: "FAQs", icon: CircleHelp },
	{ href: "/dashboard/channels", label: "Canales", icon: PlugZap },
	{ href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

const platformItems = [{ href: "/dashboard/platform/tenants", label: "Tenants", icon: Shield }];

function SidebarContent({
	isPlatformAdmin,
	onNavigate,
}: {
	isPlatformAdmin: boolean;
	onNavigate?: () => void;
}) {
	const pathname = usePathname();
	const navigationItems = isPlatformAdmin ? [...items, ...platformItems] : items;

	return (
		<div className="flex h-full flex-col bg-sidebar">
			<div className="border-b border-sidebar-border px-6 py-6">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Agente Inmobiliaria</p>
				<h2 className="mt-3 text-xl font-bold tracking-tight text-sidebar-foreground">
					Operación comercial
				</h2>
				<p className="mt-1.5 text-sm leading-6 text-muted-foreground">
					CRM conversacional para inmobiliarias multitenant.
				</p>
			</div>
			<nav className="flex-1 space-y-1 px-4 py-5">
				{navigationItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						pathname === item.href ||
						(item.href !== "/dashboard" && pathname.startsWith(item.href));

					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onNavigate}
							className={cn(
								"group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
								isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
							)}
						>
							<span
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border bg-card text-muted-foreground transition group-hover:border-primary/20 group-hover:text-primary",
									isActive && "border-primary/15 bg-lightprimary text-primary",
								)}
							>
								<Icon className="h-4 w-4" />
							</span>
							<span className="truncate">{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}

export function Sidebar({ isPlatformAdmin }: { isPlatformAdmin: boolean }) {
	return (
		<aside className="hidden w-[18rem] shrink-0 border-r border-sidebar-border xl:flex xl:flex-col">
			<SidebarContent isPlatformAdmin={isPlatformAdmin} />
		</aside>
	);
}

export function MobileSidebarContent({
	isPlatformAdmin,
	onNavigate,
}: {
	isPlatformAdmin: boolean;
	onNavigate?: () => void;
}) {
	return <SidebarContent isPlatformAdmin={isPlatformAdmin} onNavigate={onNavigate} />;
}
