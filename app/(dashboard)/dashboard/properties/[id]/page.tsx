import Link from "next/link";

import { deletePropertyAction } from "@/features/properties/actions";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { getPropertyById } from "@/server/queries/properties";
import { formatCurrency } from "@/lib/utils";

export default async function PropertyDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { activeTenant } = await getActiveTenantContext();
	const property = await getPropertyById(activeTenant.id, id);
	const deleteAction = deletePropertyAction.bind(null, property.id);

	return (
		<>
			<PageHeader
				title={property.title}
				description={property.location_text ?? "Sin ubicación resumida"}
			>
				<div className="flex gap-3">
					<Link className="text-sm font-medium text-teal-700" href={`/dashboard/properties/${property.id}/edit`}>
						Editar
					</Link>
					<form action={deleteAction}>
						<Button type="submit" variant="destructive">
							Eliminar
						</Button>
					</form>
				</div>
			</PageHeader>
			<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<Card>
					<CardHeader>
						<CardTitle>Ficha comercial</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Estado</span>
							<Badge variant={property.status === "available" ? "success" : "outline"}>
								{property.status}
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Operación</span>
							<span className="capitalize">{property.operation_type}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Tipo</span>
							<span className="capitalize">{property.property_type}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Precio</span>
							<span>{formatCurrency(property.price, property.currency, activeTenant.locale)}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Dormitorios</span>
							<span>{property.bedrooms ?? "N/D"}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Baños</span>
							<span>{property.bathrooms ?? "N/D"}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Superficie</span>
							<span>{property.area_m2 ?? "N/D"} m²</span>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Descripción</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<p>{property.description ?? "Sin descripción cargada."}</p>
						<div className="rounded-lg border border-border bg-slate-50 p-4">
							<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
								Regla de producto
							</p>
							<p className="mt-2">
								Esta ficha es la verdad de negocio. La IA puede redactar respuestas, pero no
								modificar disponibilidad ni precio por su cuenta.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

