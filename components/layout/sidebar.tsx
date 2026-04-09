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

export function Sidebar({ isPlatformAdmin }: { isPlatformAdmin: boolean }) {
	const pathname = usePathname();
	const navigationItems = isPlatformAdmin ? [...items, ...platformItems] : items;

	return (
		<aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950 text-slate-100 md:flex md:flex-col">
			<div className="border-b border-white/10 px-6 py-6">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
					Agente Inmobiliaria
				</p>
				<h2 className="mt-2 text-xl font-semibold tracking-tight">SaaS comercial multitenant</h2>
			</div>
			<nav className="flex-1 space-y-1 px-4 py-6">
				{navigationItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						pathname === item.href ||
						(item.href !== "/dashboard" && pathname.startsWith(item.href));

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white",
								isActive && "bg-teal-500/10 text-white ring-1 ring-inset ring-teal-500/30",
							)}
						>
							<Icon className="h-4 w-4" />
							{item.label}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
