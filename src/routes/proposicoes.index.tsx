import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Chip, EmptyState, ErrorState, Loading, Panel, PanelTitle } from "@/components/civic";
import { proposicoesQuery } from "@/lib/camara";

const TIPOS = ["PL", "PEC", "PLP", "MPV", "PDL", "REQ", "PRC"];
const ANO_ATUAL = new Date().getFullYear();
const ANOS = Array.from({ length: 8 }, (_, i) => ANO_ATUAL - i);

export const Route = createFileRoute("/proposicoes/")({
  head: () => ({
    meta: [
      { title: "Rastreador de Proposições — Monitor Legislativo" },
      {
        name: "description",
        content:
          "Busque projetos de lei, PECs e medidas provisórias por tema e acompanhe a linha do tempo da tramitação.",
      },
      { property: "og:title", content: "Rastreador de Proposições — Monitor Legislativo" },
      {
        property: "og:description",
        content: "Ementas, situação atual e histórico completo de tramitação de cada matéria.",
      },
    ],
  }),
  component: ListaProposicoes,
});

function ListaProposicoes() {
  const [tipo, setTipo] = useState("PL");
  const [ano, setAno] = useState(ANO_ATUAL);
  const [tema, setTema] = useState("");
  const [temaAplicado, setTemaAplicado] = useState("");

  const lista = useQuery(
    proposicoesQuery({ siglaTipo: tipo, ano, keywords: temaAplicado || undefined }),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="eyebrow">Módulo 4</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Rastreador de Proposições</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Encontre matérias por tipo, ano e tema e acompanhe cada movimento entre comissões até o
        plenário.
      </p>

      <Panel className="mt-8 p-4">
        <form
          className="grid gap-3 sm:grid-cols-[auto_auto_1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            setTemaAplicado(tema.trim());
          }}
        >
          <select
            value={tipo}
            aria-label="Tipo de proposição"
            onChange={(e) => setTipo(e.target.value)}
            className="data h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary/60"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={ano}
            aria-label="Ano"
            onChange={(e) => setAno(Number(e.target.value))}
            className="data h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary/60"
          >
            {ANOS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <input
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Tema (ex.: inteligência artificial, saúde, tributária)"
            aria-label="Tema"
            className="data h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary/60"
          />
          <button
            type="submit"
            className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Buscar
          </button>
        </form>
      </Panel>

      <Panel className="mt-6">
        <PanelTitle
          eyebrow={temaAplicado ? `Tema: ${temaAplicado}` : "Sem filtro de tema"}
          title={`${tipo} · ${ano}`}
          right={<Chip tone="info">{lista.data?.length ?? 0} matérias</Chip>}
        />
        {lista.isLoading ? <Loading /> : null}
        {lista.isError ? <ErrorState error={lista.error} /> : null}
        {lista.data?.length === 0 ? (
          <EmptyState>Nenhuma matéria encontrada para esse recorte.</EmptyState>
        ) : null}
        <ul className="divide-y divide-border">
          {lista.data?.map((p) => (
            <li key={p.id}>
              <Link
                to="/proposicoes/$id"
                params={{ id: String(p.id) }}
                className="block px-5 py-4 transition-colors hover:bg-muted/50"
              >
                <p className="data text-xs text-primary">
                  {p.siglaTipo} {p.numero}/{p.ano}
                </p>
                <p className="mt-1 line-clamp-3 text-sm text-foreground">{p.ementa}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
