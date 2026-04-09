import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
		<div className="space-y-6">
			<div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
				<div className="space-y-2">
					<h1 className="text-foreground text-5xl leading-none font-semibold tracking-tight">
						Propiedades
					</h1>
					<p className="max-w-3xl text-lg text-muted-foreground">
						Inventario central del tenant. Source of truth para respuestas comerciales.
					</p>
				</div>
				<Link href="/dashboard/properties/new">
					<Button>Nueva propiedad</Button>
				</Link>
			</div>
			<DashboardTopCards
				items={[
					{ key: "total", label: "Total propiedades", value: properties.length, tone: "primary" },
					{ key: "available", label: "Disponibles", value: availableCount, tone: "success" },
					{ key: "draft", label: "Borradores", value: draftCount, tone: "warning" },
				]}
			/>
			{properties.length === 0 ? (
				<EmptyState
					title="No hay propiedades cargadas"
					description="El MVP necesita este catálogo para responder FAQs y asociar leads a oferta real."
					actionHref="/dashboard/properties/new"
					actionLabel="Cargar propiedad"
				/>
			) : (
				<CardBox className="overflow-hidden">
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
				</CardBox>
			)}
		</div>
	);
}
