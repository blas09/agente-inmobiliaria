import { ProfileWelcome } from "@/components/dashboard/profile-welcome";
import { createFaqAction } from "@/features/faqs/actions";
import { FaqForm } from "@/features/faqs/faq-form";

export default function NewFaqPage() {
  return (
    <div className="space-y-6">
      <ProfileWelcome title="Nueva FAQ" />
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-sm font-medium">Editorial</p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Las FAQs ayudan a responder más rápido sin depender de que el modelo
            invente información.
          </p>
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-sm font-medium">Por tenant</p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Cada respuesta vive aislada dentro de la inmobiliaria activa.
          </p>
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-sm font-medium">Control</p>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Podés activarla o desactivarla sin perder el historial del
            contenido.
          </p>
        </div>
      </section>
      <FaqForm action={createFaqAction} />
    </div>
  );
}
