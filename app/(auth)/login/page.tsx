import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-background px-6 py-10 md:px-10">
			<div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.12fr_0.88fr]">
				<div className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
						Plataforma comercial inmobiliaria
					</p>
					<div className="mt-5 max-w-2xl space-y-4">
						<h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
							Operación conversacional con foco en propiedades, leads y contexto real.
						</h1>
						<p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
							Un dashboard SaaS para inmobiliarias que necesitan responder mejor, derivar a
							tiempo y ordenar su operación comercial sin perder aislamiento por tenant.
						</p>
					</div>
					<div className="mt-8 rounded-2xl bg-lightprimary px-5 py-4 text-sm text-primary">
						Una inmobiliaria por tenant. Datos aislados, operación trazable y canales
						conectados por cuenta propia del cliente.
					</div>
					<div className="mt-8 grid gap-4 md:grid-cols-3">
						<div className="rounded-2xl border border-border bg-card p-5">
							<p className="text-sm font-medium text-foreground">Multi-tenancy correcto</p>
							<p className="mt-2 text-sm leading-6 text-muted-foreground">
								`tenant_id` obligatorio, membresías activas y RLS como enforcement real.
							</p>
						</div>
						<div className="rounded-2xl border border-border bg-card p-5">
							<p className="text-sm font-medium text-foreground">Canales desacoplados</p>
							<p className="mt-2 text-sm leading-6 text-muted-foreground">
								WhatsApp modelado por tenant sin asumir propiedad de las cuentas del cliente.
							</p>
						</div>
						<div className="rounded-2xl border border-border bg-card p-5">
							<p className="text-sm font-medium text-foreground">IA con límites claros</p>
							<p className="mt-2 text-sm leading-6 text-muted-foreground">
								La IA redacta e interpreta. La base define precio, estado y reglas.
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
