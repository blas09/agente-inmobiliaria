import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listProperties } from "@/server/queries/properties";
import { formatCurrency } from "@/lib/utils";

export default async function PropertiesPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; status?: string }>;
}) {
	const params = await searchParams;
	const { activeTenant } = await getActiveTenantContext();
	const properties = await listProperties(activeTenant.id, params);

	return (
		<>
			<PageHeader
				title="Propiedades"
				description="Inventario central del tenant. Source of truth para respuestas comerciales."
				actionHref="/dashboard/properties/new"
				actionLabel="Nueva propiedad"
			>
				<form className="flex flex-col gap-2 md:flex-row">
					<Input defaultValue={params.q} name="q" placeholder="Buscar por título o ubicación" />
					<Select defaultValue={params.status ?? "all"} name="status">
						<option value="all">Todos los estados</option>
						<option value="available">Disponibles</option>
						<option value="draft">Borrador</option>
						<option value="reserved">Reservadas</option>
						<option value="inactive">Inactivas</option>
					</Select>
					<Button type="submit" variant="outline">
						Filtrar
					</Button>
				</form>
			</PageHeader>
			{properties.length === 0 ? (
				<EmptyState
					title="No hay propiedades cargadas"
					description="El MVP necesita este catálogo para responder FAQs y asociar leads a oferta real."
				/>
			) : (
				<div className="overflow-hidden rounded-xl border border-border bg-white">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Propiedad</TableHead>
								<TableHead>Operación</TableHead>
								<TableHead>Ubicación</TableHead>
								<TableHead>Precio</TableHead>
								<TableHead>Estado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{properties.map((property) => (
								<TableRow key={property.id}>
									<TableCell>
										<Link
											className="font-medium text-slate-900 hover:text-teal-700"
											href={`/dashboard/properties/${property.id}`}
										>
											{property.title}
										</Link>
										<p className="text-xs text-muted-foreground">{property.external_ref ?? "sin ref"}</p>
									</TableCell>
									<TableCell className="capitalize">{property.operation_type}</TableCell>
									<TableCell>{property.location_text ?? property.city ?? "Sin ubicación"}</TableCell>
									<TableCell>{formatCurrency(property.price, property.currency, activeTenant.locale)}</TableCell>
									<TableCell>
										<Badge variant={property.status === "available" ? "success" : "outline"}>
											{property.status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</>
	);
}
