import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const qualifiedCount = leads.filter(
    (lead) => lead.qualification_status === "qualified",
  ).length;
  const newCount = leads.filter(
    (lead) => lead.qualification_status === "new",
  ).length;

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="Leads"
        action={
          <Link href="/dashboard/leads/new">
            <Button>Nuevo lead</Button>
          </Link>
        }
      />
      <DashboardTopCards
        items={[
          {
            key: "total",
            label: "Total leads",
            value: leads.length,
            tone: "primary",
          },
          { key: "new", label: "Nuevos", value: newCount, tone: "warning" },
          {
            key: "qualified",
            label: "Calificados",
            value: qualifiedCount,
            tone: "success",
          },
        ]}
      />
      {leads.length === 0 ? (
        <EmptyState
          title="No hay leads todavía"
          description="Podés cargarlos manualmente o dejar lista la estructura para WhatsApp y otros canales."
          actionHref="/dashboard/leads/new"
          actionLabel="Crear lead"
        />
      ) : (
        <CardBox className="overflow-hidden">
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
                        className="text-foreground hover:text-primary font-semibold"
                        href={`/dashboard/leads/${lead.id}`}
                      >
                        {lead.full_name}
                      </Link>
                      <p className="text-muted-foreground text-xs">
                        {lead.email ?? lead.phone ?? "Sin contacto"}
                      </p>
                    </TableCell>
                    <TableCell>{lead.source ?? "Sin fuente"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lead.qualification_status === "qualified"
                            ? "lightSuccess"
                            : "outline"
                        }
                      >
                        {lead.qualification_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.score ?? "-"}</TableCell>
                    <TableCell className="pr-6 whitespace-nowrap">
                      {formatDateTime(lead.created_at)}
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
