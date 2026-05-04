import Link from "next/link";

import { CardBox } from "@/components/dashboard/card-box";
import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { DashboardTopCards } from "@/components/dashboard/top-cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveTenantContext } from "@/server/auth/tenant-context";
import { listFaqs } from "@/server/queries/faqs";
import { canManageFaqs } from "@/lib/permissions";
import { getFaqStatusLabel } from "@/lib/ui-labels";

export default async function FaqsPage() {
  const { activeTenant, activeMembership } = await getActiveTenantContext();
  const canManageTenantFaqs = canManageFaqs(activeMembership.role);
  const faqs = await listFaqs(activeTenant.id);
  const activeFaqs = faqs.filter((faq) => faq.status === "active").length;

  return (
    <div className="space-y-6">
      <ProfileWelcome
        title="FAQs"
        description="Respuestas base para sostener conversaciones consistentes con criterio comercial."
        action={
          canManageTenantFaqs ? (
            <Link href="/dashboard/faqs/new">
              <Button>Nueva FAQ</Button>
            </Link>
          ) : null
        }
      />
      <DashboardTopCards
        items={[
          { key: "total", label: "FAQs", value: faqs.length, tone: "primary" },
          {
            key: "active",
            label: "Activas",
            value: activeFaqs,
            tone: "success",
          },
          {
            key: "inactive",
            label: "Inactivas",
            value: faqs.length - activeFaqs,
            tone: "warning",
          },
        ]}
      />
      {faqs.length === 0 ? (
        <EmptyState
          title="Todavía no hay FAQs"
          description="Las respuestas base del tenant permiten cubrir preguntas frecuentes con criterio editorial."
          actionHref={canManageTenantFaqs ? "/dashboard/faqs/new" : undefined}
          actionLabel={canManageTenantFaqs ? "Crear FAQ" : undefined}
        />
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <CardBox key={faq.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    {canManageTenantFaqs ? (
                      <Link href={`/dashboard/faqs/${faq.id}/edit`}>
                        <CardTitle className="hover:text-primary text-base">
                          {faq.question}
                        </CardTitle>
                      </Link>
                    ) : (
                      <CardTitle className="text-base">
                        {faq.question}
                      </CardTitle>
                    )}
                    <CardDescription>
                      {faq.category ?? "Sin categoría"}
                    </CardDescription>
                  </div>
                  <Badge
                    className="w-fit"
                    variant={
                      faq.status === "active" ? "lightSuccess" : "outline"
                    }
                  >
                    {getFaqStatusLabel(faq.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-4 text-sm leading-6">
                  {faq.answer}
                </p>
              </CardContent>
            </CardBox>
          ))}
        </div>
      )}
    </div>
  );
}
