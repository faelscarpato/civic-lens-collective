import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Chip, EmptyState, ErrorState, Loading, Panel, PanelTitle } from "@/components/civic";
import { dataHoraBr, votacoesQuery } from "@/lib/camara";

export const Route = createFileRoute("/votacoes/")({
  head: () => ({
    meta: [
      { title: "Mapa de Votações e Fidelidade — Monitor Legislativo" },
      {
        name: "description",
        content:
          "Votações nominais recentes da Câmara com placar por bancada e índice de dissidência frente à orientação do partido.",
      },
      { property: "og:title", content: "Mapa de Votações e Fidelidade — Monitor Legislativo" },
      {
        property: "og:description",
        content: "Placar do plenário, orientação das lideranças e cálculo de dissidência.",
      },
    ],
  }),
  component: ListaVotacoes,
});

function ListaVotacoes() {
  const [filtro, setFiltro] = useState("");
  const votacoes = useQuery(votacoesQuery(60));

  const itens = (votacoes.data ?? []).filter((v) =>
    (v.descricao + v.siglaOrgao).toLowerCase().includes(filtro.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="eyebrow">Módulo 3</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Mapa de Votações & Fidelidade</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Abra qualquer votação para ver o placar nominal completo, a orientação oficial de cada
        bancada e quantos parlamentares votaram contra a própria liderança.
      </p>

      <Panel className="mt-8">
        <PanelTitle
          eyebrow="Registros mais recentes"
          title="Votações da Câmara"
          right={
            <input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Filtrar por termo ou órgão"
              aria-label="Filtrar votações"
              className="data h-10 w-full rounded-md border border-input bg-background px-3 text-xs outline-none focus:border-primary/60 sm:w-72"
            />
          }
        />
        {votacoes.isLoading ? <Loading /> : null}
        {votacoes.isError ? <ErrorState error={votacoes.error} /> : null}
        {votacoes.data && itens.length === 0 ? (
          <EmptyState>Nenhuma votação corresponde ao filtro.</EmptyState>
        ) : null}
        <ul className="divide-y divide-border">
          {itens.map((v) => (
            <li key={v.id}>
              <Link
                to="/votacoes/$id"
                params={{ id: v.id }}
                className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm">{v.descricao || "Votação sem descrição publicada"}</p>
                  <p className="data mt-1 text-xs text-muted-foreground">
                    {v.siglaOrgao} · {dataHoraBr(v.dataHoraRegistro)} · {v.id}
                  </p>
                </div>
                <Chip tone={v.aprovacao === 1 ? "success" : "destructive"}>
                  {v.aprovacao === 1 ? "aprovada" : "rejeitada"}
                </Chip>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
