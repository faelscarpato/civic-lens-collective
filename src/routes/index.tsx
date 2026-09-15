import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Chip,
  EmptyState,
  ErrorState,
  Loading,
  ModuleCard,
  Panel,
  PanelTitle,
  Stat,
} from "@/components/civic";
import {
  dataBr,
  deputadosQuery,
  partidosQuery,
  votacoesQuery,
} from "@/lib/camara";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monitor Legislativo — Painel de Inteligência Cívica" },
      {
        name: "description",
        content:
          "Painel ao vivo da Câmara dos Deputados: dossiês parlamentares, cota CEAP, votações nominais e tramitação de projetos.",
      },
      { property: "og:title", content: "Monitor Legislativo — Painel de Inteligência Cívica" },
      {
        property: "og:description",
        content:
          "Auditoria cívica em tempo real: 513 deputados, gastos da cota, votações nominais e fidelidade partidária.",
      },
    ],
  }),
  component: Painel,
});

function Painel() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  const deputados = useQuery(deputadosQuery());
  const partidos = useQuery(partidosQuery());
  const votacoes = useQuery(votacoesQuery(8));

  const aprovadas = votacoes.data?.filter((v) => v.aprovacao === 1).length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <section>
        <p className="eyebrow">Sala de situação · Congresso Nacional</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl">
          Tudo que a Câmara publica, cruzado em um só lugar.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Dossiê completo de cada parlamentar, varredura da cota parlamentar, placar de votações
          nominais com índice de dissidência e rastreio da tramitação de projetos — consultado ao
          vivo nas bases oficiais.
        </p>

        <form
          className="mt-8 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/deputados", search: { nome: busca || undefined } });
          }}
        >
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar parlamentar por nome…"
            aria-label="Buscar parlamentar por nome"
            className="data h-12 flex-1 rounded-md border border-input bg-surface px-4 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="submit"
            className="h-12 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Investigar
          </button>
        </form>
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Parlamentares em exercício"
          value={deputados.isLoading ? "…" : (deputados.data?.length ?? 0)}
          hint="Legislatura atual"
          tone="primary"
        />
        <Stat
          label="Partidos com registro"
          value={partidos.isLoading ? "…" : (partidos.data?.length ?? 0)}
          hint="Base de partidos da Câmara"
        />
        <Stat
          label="Votações recentes"
          value={votacoes.isLoading ? "…" : (votacoes.data?.length ?? 0)}
          hint="Últimos registros de plenário e comissões"
          tone="info"
        />
        <Stat
          label="Aprovadas no recorte"
          value={votacoes.isLoading ? "…" : aprovadas}
          hint="Marcadas como aprovadas pela Casa"
          tone="warning"
        />
      </section>

      <section className="mt-12">
        <p className="eyebrow">Arquitetura da plataforma</p>
        <h2 className="mt-2 text-2xl font-semibold">Cinco módulos de auditoria</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            numero="1"
            titulo="Perfil Parlamentar 360°"
            descricao="Biografia, gabinete, comissões, frentes parlamentares, discursos, histórico de partidos e mandatos anteriores."
            to="/deputados"
          />
          <ModuleCard
            numero="2"
            titulo="Auditor da Cota (CEAP)"
            descricao="Despesas mês a mês, categorias de gasto e ranking de fornecedores recorrentes por parlamentar."
            to="/deputados"
          />
          <ModuleCard
            numero="3"
            titulo="Votações & Fidelidade"
            descricao="Placar nominal por bancada e índice de dissidência entre o voto e a orientação da liderança."
            to="/votacoes"
          />
          <ModuleCard
            numero="4"
            titulo="Rastreador de Tramitação"
            descricao="Linha do tempo de projetos e PECs, com situação, despacho e órgão responsável em cada etapa."
            to="/proposicoes"
          />
          <ModuleCard
            numero="5"
            titulo="Compliance & Transparência"
            descricao="Checagem de improbidade no CNJ, processos no DataJud, contas eleitorais do TSE e ranking PNTP."
            status="fase 3–4"
          />
        </div>
      </section>

      <section className="mt-12">
        <Panel>
          <PanelTitle
            eyebrow="Módulo 3"
            title="Últimas votações registradas"
            right={
              <Link to="/votacoes" className="data text-xs uppercase tracking-wider text-primary">
                ver todas →
              </Link>
            }
          />
          {votacoes.isLoading ? <Loading /> : null}
          {votacoes.isError ? <ErrorState error={votacoes.error} /> : null}
          {votacoes.data?.length === 0 ? <EmptyState>Nenhuma votação retornada.</EmptyState> : null}
          <ul className="divide-y divide-border">
            {votacoes.data?.map((v) => (
              <li key={v.id}>
                <Link
                  to="/votacoes/$id"
                  params={{ id: v.id }}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm text-foreground">
                      {v.descricao || "Votação sem descrição publicada"}
                    </p>
                    <p className="data mt-1 text-xs text-muted-foreground">
                      {v.siglaOrgao} · {dataBr(v.data)} · {v.id}
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
      </section>
    </div>
  );
}
