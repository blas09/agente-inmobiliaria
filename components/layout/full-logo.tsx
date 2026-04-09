"use client";

export function FullLogo() {
	return (
		<div className="inline-flex max-w-full items-center gap-3">
			<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
				A
			</span>
			<span className="min-w-0 truncate text-[1.05rem] leading-none font-semibold tracking-tight text-sidebar-foreground">
				Agente<span className="font-normal text-muted-foreground">Inmobiliaria</span>
			</span>
		</div>
	);
}
