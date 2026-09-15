import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return <div className={cn("panel", hover && "panel-hover", className)}>{children}</div>;
}

export function PanelTitle({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "primary" | "warning" | "destructive" | "info";
}) {
  const toneClass = {
    default: "text-foreground",
    primary: "text-primary",
    warning: "text-warning",
    destructive: "text-destructive",
    info: "text-info",
  }[tone];
  return (
    <Panel className="p-5">
      <p className="eyebrow">{label}</p>
      <p className={cn("data mt-2 text-2xl font-semibold", toneClass)}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </Panel>
  );
}

export function Chip({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "success" | "warning" | "destructive" | "info";
}) {
  const tones = {
    muted: "border-border bg-muted text-muted-foreground",
    primary: "border-primary/40 bg-primary/10 text-primary",
    success: "border-success/40 bg-success/10 text-success",
    warning: "border-warning/40 bg-warning/10 text-warning",
    destructive: "border-destructive/40 bg-destructive/10 text-destructive",
    info: "border-info/40 bg-info/10 text-info",
  }[tone];
  return (
    <span
      className={cn(
        "data inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wider",
        tones,
      )}
    >
      {children}
    </span>
  );
}

export function Loading({ label = "Consultando bases públicas…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-10 text-sm text-muted-foreground">
      <span className="size-2 animate-pulse rounded-full bg-primary" />
      {label}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="px-5 py-8 text-sm text-muted-foreground">{children}</p>;
}

export function ErrorState({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : "Falha ao consultar a base.";
  return (
    <p className="px-5 py-8 text-sm text-destructive">
      {msg} Tente novamente em alguns instantes — a fonte oficial limita consultas simultâneas.
    </p>
  );
}

export function ModuleCard({
  numero,
  titulo,
  descricao,
  to,
  status,
}: {
  numero: string;
  titulo: string;
  descricao: string;
  to?: "/deputados" | "/votacoes" | "/proposicoes";
  status?: string;
}) {
  const inner = (
    <Panel hover={!!to} className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <span className="data text-xs text-primary">MÓDULO {numero}</span>
        {status ? <Chip tone="warning">{status}</Chip> : <Chip tone="primary">ativo</Chip>}
      </div>
      <h3 className="mt-3 text-base font-semibold">{titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{descricao}</p>
    </Panel>
  );
  if (!to) return inner;
  return (
    <Link to={to} className="block h-full">
      {inner}
    </Link>
  );
}
