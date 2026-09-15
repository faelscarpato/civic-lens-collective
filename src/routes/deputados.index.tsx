import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Chip, EmptyState, ErrorState, Loading, Panel } from "@/components/civic";
import { deputadosQuery, partidosQuery, UFS } from "@/lib/camara";

type Search = { nome?: string; uf?: string; partido?: string };

export const Route = createFileRoute("/deputados/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    nome: typeof search.nome === "string" && search.nome ? search.nome : undefined,
    uf: typeof search.uf === "string" && search.uf ? search.uf : undefined,
    partido: typeof search.partido === "string" && search.partido ? search.partido : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Radar Parlamentar 360° — Monitor Legislativo" },
      {
        name: "description",
        content:
          "Busque qualquer deputado federal por nome, estado ou partido e abra o dossiê completo com gastos, votos e comissões.",
      },
      { property: "og:title", content: "Radar Parlamentar 360° — Monitor Legislativo" },
      {
        property: "og:description",
        content: "Busca instantânea de deputados federais com dossiê completo de atuação e gastos.",
      },
    ],
  }),
  component: ListaDeputados,
});

function ListaDeputados() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [termo, setTermo] = useState(search.nome ?? "");

  const partidos = useQuery(partidosQuery());
  const lista = useQuery(
    deputadosQuery({ nome: search.nome, siglaUf: search.uf, siglaPartido: search.partido }),
  );

  const porPartido = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const d of lista.data ?? []) {
      mapa.set(d.siglaPartido, (mapa.get(d.siglaPartido) ?? 0) + 1);
    }
    return [...mapa.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [lista.data]);

  const set = (patch: Search) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...patch }), replace: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="eyebrow">Módulo 1</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Radar Parlamentar 360°</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Filtre a bancada e abra o dossiê de qualquer parlamentar: gabinete, comissões, frentes,
        discursos, histórico partidário e a varredura completa da cota parlamentar.
      </p>

      <Panel className="mt-8 p-4">
        <form
          className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            set({ nome: termo || undefined });
          }}
        >
          <input
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Nome do parlamentar"
            aria-label="Nome do parlamentar"
            className="data h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary/60"
          />
          <select
            value={search.uf ?? ""}
            aria-label="Estado"
            onChange={(e) => set({ uf: e.target.value || undefined })}
            className="data h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary/60"
          >
            <option value="">Todos os estados</option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          <select
            value={search.partido ?? ""}
            aria-label="Partido"
            onChange={(e) => set({ partido: e.target.value || undefined })}
            className="data h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary/60"
          >
            <option value="">Todos os partidos</option>
            {partidos.data?.map((p) => (
              <option key={p.id} value={p.sigla}>
                {p.sigla}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Filtrar
          </button>
        </form>
      </Panel>

      {porPartido.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {porPartido.map(([sigla, total]) => (
            <button key={sigla} onClick={() => set({ partido: sigla })} type="button">
              <Chip tone={search.partido === sigla ? "primary" : "muted"}>
                {sigla} · {total}
              </Chip>
            </button>
          ))}
        </div>
      ) : null}

      {lista.isLoading ? <Loading label="Carregando bancada…" /> : null}
      {lista.isError ? <ErrorState error={lista.error} /> : null}
      {lista.data?.length === 0 ? (
        <EmptyState>Nenhum parlamentar encontrado com esses filtros.</EmptyState>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lista.data?.map((d) => (
          <Link key={d.id} to="/deputados/$id" params={{ id: String(d.id) }}>
            <Panel hover className="flex h-full items-center gap-3 p-4">
              <img
                src={d.urlFoto}
                alt={`Foto de ${d.nome}`}
                loading="lazy"
                className="size-14 shrink-0 rounded-md border border-border object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{d.nome}</p>
                <p className="data mt-1 text-xs text-muted-foreground">
                  {d.siglaPartido} · {d.siglaUf}
                </p>
              </div>
            </Panel>
          </Link>
        ))}
      </div>

      {lista.data && lista.data.length >= 100 ? (
        <p className="mt-6 text-xs text-muted-foreground">
          Exibindo os 100 primeiros resultados. Refine por estado ou partido para ver o restante.
        </p>
      ) : null}
    </div>
  );
}
