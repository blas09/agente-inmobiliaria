import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-6 py-16 text-white">
			<div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.25fr_0.9fr]">
				<div className="max-w-2xl space-y-8">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
						Arquitectura SaaS inmobiliaria
					</p>
					<div className="space-y-4">
						<h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
							Atención comercial multicanal con verdad de negocio estructurada.
						</h1>
						<p className="max-w-xl text-base text-slate-300 md:text-lg">
							Foundation orientada a WhatsApp, RLS obligatoria, tenants aislados y un CRM
							comercial simple pero extensible.
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="rounded-2xl border border-white/10 bg-white/5 p-5">
							<p className="text-sm font-medium text-white">Multi-tenancy correcto</p>
							<p className="mt-2 text-sm text-slate-300">
								`tenant_id` obligatorio, membresías activas y RLS como enforcement real.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-5">
							<p className="text-sm font-medium text-white">Canales desacoplados</p>
							<p className="mt-2 text-sm text-slate-300">
								WhatsApp modelado por tenant sin asumir propiedad de las cuentas del cliente.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-5">
							<p className="text-sm font-medium text-white">IA con límites claros</p>
							<p className="mt-2 text-sm text-slate-300">
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

