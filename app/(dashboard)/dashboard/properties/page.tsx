import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { FilterCard } from "@/components/shared/filter-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
	const availableCount = properties.filter((property) => property.status === "available").length;
	const draftCount = properties.filter((property) => property.status === "draft").length;

	return (
		<>
			<PageHeader
				title="Propiedades"
				description="Inventario central del tenant. Source of truth para respuestas comerciales."
				actionHref="/dashboard/properties/new"
				actionLabel="Nueva propiedad"
			>
				<form className="w-full" method="get">
					<FilterCard>
						<div className="grid gap-3 md:grid-cols-[1.6fr_0.8fr_auto]">
						<Input defaultValue={params.q} name="q" placeholder="Buscar por título o ubicación" />
						<NativeSelect defaultValue={params.status ?? "all"} name="status">
							<option value="all">Todos los estados</option>
							<option value="available">Disponibles</option>
							<option value="draft">Borrador</option>
							<option value="reserved">Reservadas</option>
							<option value="inactive">Inactivas</option>
						</NativeSelect>
						<Button type="submit" variant="outline">
							Filtrar
						</Button>
						</div>
					</FilterCard>
				</form>
			</PageHeader>
			<section className="grid gap-4 md:grid-cols-3">
				<MetricCard label="Total propiedades" tone="primary" value={properties.length} />
				<MetricCard label="Disponibles" tone="success" value={availableCount} />
				<MetricCard label="Borradores" tone="warning" value={draftCount} />
			</section>
			{properties.length === 0 ? (
				<EmptyState
					title="No hay propiedades cargadas"
					description="El MVP necesita este catálogo para responder FAQs y asociar leads a oferta real."
					actionHref="/dashboard/properties/new"
					actionLabel="Cargar propiedad"
				/>
			) : (
				<Card className="overflow-hidden">
					<CardContent className="overflow-x-auto p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="px-6">Propiedad</TableHead>
									<TableHead>Operación</TableHead>
									<TableHead>Ubicación</TableHead>
									<TableHead>Precio</TableHead>
									<TableHead className="pr-6">Estado</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{properties.map((property) => (
									<TableRow key={property.id}>
										<TableCell className="min-w-[280px] px-6 py-5">
											<Link
												className="font-semibold text-foreground hover:text-primary"
												href={`/dashboard/properties/${property.id}`}
											>
												{property.title}
											</Link>
											<p className="mt-1 text-xs text-muted-foreground">
												{property.external_ref ?? "sin ref"} · {property.property_type}
											</p>
										</TableCell>
										<TableCell className="capitalize">{property.operation_type}</TableCell>
										<TableCell>{property.location_text ?? property.city ?? "Sin ubicación"}</TableCell>
										<TableCell className="whitespace-nowrap font-medium">
											{formatCurrency(property.price, property.currency, activeTenant.locale)}
										</TableCell>
										<TableCell className="pr-6">
											<Badge variant={property.status === "available" ? "lightSuccess" : "outline"}>
												{property.status}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</>
	);
}
