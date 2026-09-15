import { queryOptions } from "@tanstack/react-query";

const BASE = "https://dadosabertos.camara.leg.br/api/v2";

type Params = Record<string, string | number | undefined | Array<string | number>>;

export async function camara<T>(path: string, params: Params = {}): Promise<T> {
  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      for (const v of value) url.searchParams.append(key, String(v));
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Câmara dos Deputados respondeu ${res.status} para ${path}`);
  }
  const json = (await res.json()) as { dados: T };
  return json.dados;
}

/* ---------------------------------- tipos --------------------------------- */

export type DeputadoResumo = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email?: string;
  idLegislatura: number;
};

export type DeputadoDetalhe = {
  id: number;
  nomeCivil: string;
  cpf?: string;
  sexo?: string;
  escolaridade?: string;
  dataNascimento?: string;
  municipioNascimento?: string;
  ufNascimento?: string;
  urlWebsite?: string;
  redeSocial?: string[];
  ultimoStatus: {
    nome: string;
    siglaPartido: string;
    siglaUf: string;
    urlFoto: string;
    condicaoEleitoral?: string;
    situacao?: string;
    descricaoStatus?: string | null;
    nomeEleitoral?: string;
    idLegislatura: number;
    gabinete?: {
      nome?: string;
      predio?: string;
      sala?: string;
      andar?: string;
      telefone?: string;
      email?: string;
    };
  };
};

export type Despesa = {
  ano: number;
  mes: number;
  tipoDespesa: string;
  codDocumento: number;
  dataDocumento: string;
  numDocumento: string;
  valorDocumento: number;
  valorLiquido: number;
  valorGlosa: number;
  urlDocumento?: string | null;
  nomeFornecedor: string;
  cnpjCpfFornecedor: string;
};

export type Discurso = {
  dataHoraInicio: string;
  tipoDiscurso: string;
  sumario: string;
  transcricao?: string;
  urlTexto?: string;
  faseEvento?: { titulo?: string };
};

export type Frente = { id: number; titulo: string; idLegislatura?: number };
export type OrgaoDeputado = {
  idOrgao: number;
  siglaOrgao: string;
  nomeOrgao: string;
  titulo: string;
  dataInicio: string;
  dataFim?: string | null;
};
export type MandatoExterno = {
  cargo: string;
  siglaUf: string;
  municipio?: string;
  anoInicio: string;
  anoFim?: string;
  siglaPartidoEleicao?: string;
};
export type Ocupacao = {
  titulo?: string;
  entidade?: string;
  entidadeUF?: string;
  anoInicio?: number | null;
  anoFim?: number | null;
};
export type Profissao = { titulo?: string; dataHora?: string };
export type HistoricoItem = {
  dataHora: string;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  situacao: string;
  condicaoEleitoral: string;
  descricaoStatus?: string | null;
};

export type VotacaoResumo = {
  id: string;
  data: string;
  dataHoraRegistro: string;
  siglaOrgao: string;
  descricao: string;
  aprovacao: number;
};

export type VotacaoDetalhe = VotacaoResumo & {
  ultimaApresentacaoProposicao?: {
    descricao?: string;
    proposicao_?: { id: number; siglaTipo: string; numero: number; ano: number; ementa?: string };
  };
  objetosPossiveis?: Array<{ id: number; siglaTipo: string; numero: number; ano: number }>;
};

export type Voto = {
  tipoVoto: string;
  dataRegistroVoto: string;
  deputado_: DeputadoResumo;
};

export type Orientacao = {
  orientacaoVoto: string;
  siglaPartidoBloco: string;
  descricao?: string;
};

export type ProposicaoResumo = {
  id: number;
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string;
};

export type ProposicaoDetalhe = ProposicaoResumo & {
  dataApresentacao: string;
  ementaDetalhada?: string | null;
  keywords?: string | null;
  urlInteiroTeor?: string | null;
  descricaoTipo?: string;
  statusProposicao?: {
    dataHora: string;
    siglaOrgao: string;
    descricaoTramitacao: string;
    descricaoSituacao?: string | null;
    despacho?: string;
    regime?: string;
  };
};

export type Tramitacao = {
  dataHora: string;
  siglaOrgao: string;
  descricaoTramitacao: string;
  descricaoSituacao?: string | null;
  despacho?: string;
  sequencia: number;
};

export type Partido = {
  id: number;
  sigla: string;
  nome: string;
  urlLogo?: string;
};

/* ------------------------------ query options ----------------------------- */

export const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export const deputadosQuery = (filtros: { nome?: string; siglaUf?: string; siglaPartido?: string } = {}) =>
  queryOptions({
    queryKey: ["deputados", filtros],
    queryFn: () =>
      camara<DeputadoResumo[]>("/deputados", {
        nome: filtros.nome,
        siglaUf: filtros.siglaUf,
        siglaPartido: filtros.siglaPartido,
        ordem: "ASC",
        ordenarPor: "nome",
        itens: 100,
      }),
    staleTime: 1000 * 60 * 30,
  });

export const deputadoQuery = (id: string) =>
  queryOptions({
    queryKey: ["deputado", id],
    queryFn: () => camara<DeputadoDetalhe>(`/deputados/${id}`),
    staleTime: 1000 * 60 * 60,
  });

export const despesasQuery = (id: string, ano: number) =>
  queryOptions({
    queryKey: ["despesas", id, ano],
    queryFn: () =>
      camara<Despesa[]>(`/deputados/${id}/despesas`, {
        ano,
        itens: 100,
        ordem: "DESC",
        ordenarPor: "mes",
      }),
    staleTime: 1000 * 60 * 30,
  });

export const discursosQuery = (id: string) =>
  queryOptions({
    queryKey: ["discursos", id],
    queryFn: () =>
      camara<Discurso[]>(`/deputados/${id}/discursos`, {
        itens: 15,
        ordem: "DESC",
        ordenarPor: "dataHoraInicio",
      }),
    staleTime: 1000 * 60 * 30,
  });

export const frentesQuery = (id: string) =>
  queryOptions({
    queryKey: ["frentes", id],
    queryFn: () => camara<Frente[]>(`/deputados/${id}/frentes`),
    staleTime: 1000 * 60 * 60,
  });

export const orgaosQuery = (id: string) =>
  queryOptions({
    queryKey: ["orgaos-deputado", id],
    queryFn: () => camara<OrgaoDeputado[]>(`/deputados/${id}/orgaos`, { itens: 100 }),
    staleTime: 1000 * 60 * 60,
  });

export const mandatosExternosQuery = (id: string) =>
  queryOptions({
    queryKey: ["mandatos-externos", id],
    queryFn: () => camara<MandatoExterno[]>(`/deputados/${id}/mandatosExternos`),
    staleTime: 1000 * 60 * 60,
  });

export const ocupacoesQuery = (id: string) =>
  queryOptions({
    queryKey: ["ocupacoes", id],
    queryFn: () => camara<Ocupacao[]>(`/deputados/${id}/ocupacoes`),
    staleTime: 1000 * 60 * 60,
  });

export const profissoesQuery = (id: string) =>
  queryOptions({
    queryKey: ["profissoes", id],
    queryFn: () => camara<Profissao[]>(`/deputados/${id}/profissoes`),
    staleTime: 1000 * 60 * 60,
  });

export const historicoQuery = (id: string) =>
  queryOptions({
    queryKey: ["historico", id],
    queryFn: () => camara<HistoricoItem[]>(`/deputados/${id}/historico`),
    staleTime: 1000 * 60 * 60,
  });

export const votacoesQuery = (itens = 30) =>
  queryOptions({
    queryKey: ["votacoes", itens],
    queryFn: () =>
      camara<VotacaoResumo[]>("/votacoes", {
        ordem: "DESC",
        ordenarPor: "dataHoraRegistro",
        itens,
      }),
    staleTime: 1000 * 60 * 10,
  });

export const votacaoQuery = (id: string) =>
  queryOptions({
    queryKey: ["votacao", id],
    queryFn: () => camara<VotacaoDetalhe>(`/votacoes/${id}`),
    staleTime: 1000 * 60 * 30,
  });

export const votosQuery = (id: string) =>
  queryOptions({
    queryKey: ["votos", id],
    queryFn: () => camara<Voto[]>(`/votacoes/${id}/votos`, { itens: 600 }),
    staleTime: 1000 * 60 * 30,
  });

export const orientacoesQuery = (id: string) =>
  queryOptions({
    queryKey: ["orientacoes", id],
    queryFn: () => camara<Orientacao[]>(`/votacoes/${id}/orientacoes`),
    staleTime: 1000 * 60 * 30,
  });

export const proposicoesQuery = (filtros: { siglaTipo?: string; ano?: number; keywords?: string } = {}) =>
  queryOptions({
    queryKey: ["proposicoes", filtros],
    queryFn: () =>
      camara<ProposicaoResumo[]>("/proposicoes", {
        siglaTipo: filtros.siglaTipo,
        ano: filtros.ano,
        keywords: filtros.keywords,
        ordem: "DESC",
        ordenarPor: "id",
        itens: 40,
      }),
    staleTime: 1000 * 60 * 15,
  });

export const proposicaoQuery = (id: string) =>
  queryOptions({
    queryKey: ["proposicao", id],
    queryFn: () => camara<ProposicaoDetalhe>(`/proposicoes/${id}`),
    staleTime: 1000 * 60 * 30,
  });

export const tramitacoesQuery = (id: string) =>
  queryOptions({
    queryKey: ["tramitacoes", id],
    queryFn: () => camara<Tramitacao[]>(`/proposicoes/${id}/tramitacoes`, { itens: 100 }),
    staleTime: 1000 * 60 * 30,
  });

export const partidosQuery = () =>
  queryOptions({
    queryKey: ["partidos"],
    queryFn: () => camara<Partido[]>("/partidos", { itens: 100, ordem: "ASC", ordenarPor: "sigla" }),
    staleTime: 1000 * 60 * 60 * 12,
  });

/* --------------------------------- helpers -------------------------------- */

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const brlExato = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const dataBr = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
};

export const dataHoraBr = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export const MESES = [
  "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez",
];

/** Normaliza o texto do voto/orientação para comparação de fidelidade. */
export const normalizaVoto = (v?: string) => {
  const t = (v ?? "").trim().toLowerCase();
  if (t.startsWith("sim")) return "Sim";
  if (t.startsWith("não") || t.startsWith("nao")) return "Não";
  if (t.startsWith("abstenç") || t.startsWith("abstenc")) return "Abstenção";
  if (t.startsWith("obstru")) return "Obstrução";
  if (t.startsWith("libera")) return "Liberado";
  if (t.startsWith("artigo")) return "Artigo 17";
  return v?.trim() || "—";
};
