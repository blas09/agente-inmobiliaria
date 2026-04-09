import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requirePlatformAdmin } from "@/server/auth/tenant-context";
import { listAllTenants } from "@/server/queries/tenants";

export default async function PlatformTenantsPage() {
	await requirePlatformAdmin();
	const tenants = await listAllTenants();

	return (
		<>
			<PageHeader
				title="Tenants"
				description="Gestión central de inmobiliarias dentro de la plataforma."
				actionHref="/dashboard/platform/tenants/new"
				actionLabel="Nuevo tenant"
			/>
			<div className="overflow-hidden rounded-xl border border-border bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tenant</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Moneda</TableHead>
							<TableHead>Timezone</TableHead>
							<TableHead>Estado</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tenants.map((tenant) => (
							<TableRow key={tenant.id}>
								<TableCell>
									<Link
										className="font-medium text-slate-900 hover:text-teal-700"
										href={`/dashboard/platform/tenants/${tenant.id}/edit`}
									>
										{tenant.name}
									</Link>
								</TableCell>
								<TableCell>{tenant.slug}</TableCell>
								<TableCell>{tenant.primary_currency}</TableCell>
								<TableCell>{tenant.timezone}</TableCell>
								<TableCell>
									<Badge variant={tenant.status === "active" ? "success" : "outline"}>
										{tenant.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}

