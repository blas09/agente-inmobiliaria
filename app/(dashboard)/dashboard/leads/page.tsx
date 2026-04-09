import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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

	return (
		<>
			<PageHeader
				title="Leads"
				description="Consultas capturadas y calificadas para el equipo comercial."
				actionHref="/dashboard/leads/new"
				actionLabel="Nuevo lead"
			>
				<form className="flex flex-col gap-2 md:flex-row">
					<Input defaultValue={params.q} name="q" placeholder="Buscar por nombre, email o teléfono" />
					<Select defaultValue={params.status ?? "all"} name="status">
						<option value="all">Todos los estados</option>
						<option value="new">Nuevo</option>
						<option value="contacted">Contactado</option>
						<option value="qualified">Calificado</option>
						<option value="lost">Perdido</option>
					</Select>
					<Button type="submit" variant="outline">
						Filtrar
					</Button>
				</form>
			</PageHeader>
			{leads.length === 0 ? (
				<EmptyState
					title="No hay leads todavía"
					description="Podés cargarlos manualmente o dejar lista la estructura para WhatsApp y otros canales."
				/>
			) : (
				<div className="overflow-hidden rounded-xl border border-border bg-white">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Lead</TableHead>
								<TableHead>Fuente</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Score</TableHead>
								<TableHead>Creado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{leads.map((lead) => (
								<TableRow key={lead.id}>
									<TableCell>
										<Link
											className="font-medium text-slate-900 hover:text-teal-700"
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
										<Badge variant={lead.qualification_status === "qualified" ? "success" : "outline"}>
											{lead.qualification_status}
										</Badge>
									</TableCell>
									<TableCell>{lead.score ?? "-"}</TableCell>
									<TableCell>{formatDateTime(lead.created_at)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</>
	);
}
