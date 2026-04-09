import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { FilterCard } from "@/components/shared/filter-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listLeads } from "@/server/queries/leads";
import { formatDateTime } from "@/lib/utils";

export default async function LeadsPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; status?: string }>;
}) {
	const params = await searchParams;
	const { activeTenant } = await getActiveTenantContext();
	const leads = await listLeads(activeTenant.id, params);
	const qualifiedCount = leads.filter((lead) => lead.qualification_status === "qualified").length;
	const newCount = leads.filter((lead) => lead.qualification_status === "new").length;

	return (
		<>
			<PageHeader
				title="Leads"
				description="Consultas capturadas y calificadas para el equipo comercial."
				actionHref="/dashboard/leads/new"
				actionLabel="Nuevo lead"
			>
				<form className="w-full" method="get">
					<FilterCard>
						<div className="grid gap-3 md:grid-cols-[1.6fr_0.8fr_auto]">
						<Input defaultValue={params.q} name="q" placeholder="Buscar por nombre, email o teléfono" />
						<NativeSelect defaultValue={params.status ?? "all"} name="status">
							<option value="all">Todos los estados</option>
							<option value="new">Nuevo</option>
							<option value="contacted">Contactado</option>
							<option value="qualified">Calificado</option>
							<option value="lost">Perdido</option>
						</NativeSelect>
						<Button type="submit" variant="outline">
							Filtrar
						</Button>
						</div>
					</FilterCard>
				</form>
			</PageHeader>
			<section className="grid gap-4 md:grid-cols-3">
				<MetricCard label="Total leads" tone="primary" value={leads.length} />
				<MetricCard label="Nuevos" tone="warning" value={newCount} />
				<MetricCard label="Calificados" tone="success" value={qualifiedCount} />
			</section>
			{leads.length === 0 ? (
				<EmptyState
					title="No hay leads todavía"
					description="Podés cargarlos manualmente o dejar lista la estructura para WhatsApp y otros canales."
					actionHref="/dashboard/leads/new"
					actionLabel="Crear lead"
				/>
			) : (
				<Card className="overflow-hidden">
					<CardContent className="overflow-x-auto p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="px-6">Lead</TableHead>
									<TableHead>Fuente</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead>Score</TableHead>
									<TableHead className="pr-6">Creado</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{leads.map((lead) => (
									<TableRow key={lead.id}>
										<TableCell className="min-w-[260px] px-6 py-5">
											<Link
												className="font-semibold text-foreground hover:text-primary"
												href={`/dashboard/leads/${lead.id}`}
											>
												{lead.full_name}
											</Link>
											<p className="text-xs text-muted-foreground">
												{lead.email ?? lead.phone ?? "Sin contacto"}
											</p>
										</TableCell>
										<TableCell>{lead.source ?? "Sin fuente"}</TableCell>
										<TableCell>
											<Badge
												variant={
													lead.qualification_status === "qualified" ? "lightSuccess" : "outline"
												}
											>
												{lead.qualification_status}
											</Badge>
										</TableCell>
										<TableCell>{lead.score ?? "-"}</TableCell>
										<TableCell className="whitespace-nowrap pr-6">{formatDateTime(lead.created_at)}</TableCell>
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
