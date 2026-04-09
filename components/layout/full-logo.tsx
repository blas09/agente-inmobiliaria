"use client";

export function FullLogo() {
  return (
    <div className="inline-flex max-w-full items-center gap-3">
      <span className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
        A
      </span>
      <span className="text-sidebar-foreground min-w-0 truncate text-[1.05rem] leading-none font-semibold tracking-tight">
        Agente
        <span className="text-muted-foreground font-normal">Inmobiliaria</span>
      </span>
    </div>
  );
}
