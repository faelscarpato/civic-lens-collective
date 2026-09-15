# Civic Compass

# 🏛️ PLANO MESTRE: PLATAFORMA DE INTELIGÊNCIA LEGISLATIVA E COMPLIANCE PÚBLICO

## *Sistema Integrado de Auditoria Cívica, Rastreabilidade Política e Monitoramento Governamental*



---



## 1. Visão Estratégica: O que significa "Pensar Grande"?



O **Monitor Legislativo** não deve ser apenas uma lista de fotos e nomes de deputados. Com as bases de dados e APIs identificadas na sua pasta, temos em mãos o ecossistema completo para construir uma **plataforma de Inteligência Cívica e Jurídica em tempo real**, equiparada a sistemas institucionais de *due diligence*, jornalismo investigativo e *GovTechs* de ponta.



### 🌐 Cruzamento Multidimensional das 4 Esferas:

1. **Atividade Parlamentar (Câmara & Senado):** Votações nominais, tramitação de projetos de lei, presença em plenário e discursos taquigráficos.

2. **Auditoria Financeira e Fornecedores (CEAP & Licitações):** Rastreamento de reembolsos da Cota Parlamentar cruzados com dados de licitações e contratos públicos.

3. **Integridade e Ficha Limpa (CNJ - CNCIAI & DataJud):** Consulta automatizada de condenações por improbidade administrativa, inelegibilidade e processos judiciais.

4. **Financiamento Partidário e Eleitoral (Bases TSE 2026):** Rastreio de doações, notas fiscais partidárias, prestação de contas e processos de impugnação.

5. **Conformidade Institucional (PNTP 2025 - ATRICON/TCU):** Ranking e auditoria do índice de transparência ativa dos órgãos públicos.



---



## 2. Arquitetura da Solução



```

                    ┌────────────────────────────────────────────────────────┐

                    │                    FONTES DE DADOS                     │

                    └────────────────────────────────────────────────────────┘

                       │                     │                   │

         [Legislação & Gastos]        [Judiciário / CNJ]     [Eleições & TCU]

         • API REST v2 Câmara         • DataJud (MTD v1.2)   • TSE 2026 (Zips)

         • SOAP SitCamaraWS           • CNIA Improbidade     • PNTP 2025 (ATRICON)

         • Senado (CSV Licitações)    • SGT / Cartórios      • Prestação Contas

                       │                     │                   │

                       ▼                     ▼                   ▼

    ┌──────────────────────────────────────────────────────────────────────────┐

    │                CAMADA DE INGESTÃO E PIPELINE (ETL / ELT)                 │

    │  • Scrapers / Consumers assíncronos (Python / FastAPI / Celery / Redis) │

    │  • Normalização de CPFs, CNPJs, IDs de Proposição e Matrículas           │

    │  • Motor de Correlação e Grafo de Vínculos (Entity Resolution)           │

    └──────────────────────────────────────────────────────────────────────────┘

                                       │

                                       ▼

    ┌──────────────────────────────────────────────────────────────────────────┐

    │                      CAMADA DE PERSISTÊNCIA & BUSCA                      │

    │  • PostgreSQL + PostGIS (Dados relacionais, mandatos, licitações)        │

    │  • Elasticsearch / OpenSearch (Busca textual em discursos, PLs e ementas)│

    │  • Graph Engine (Neo4j / NetworkX para mapear deputados <-> empresas)    │

    └──────────────────────────────────────────────────────────────────────────┘

                                       │

                                       ▼

    ┌──────────────────────────────────────────────────────────────────────────┐

    │                 CAMADA DE APLICAÇÃO & SERVIÇOS (BACKEND)                 │

    │  • API Gateway / GraphQL / REST                                          │

    │  • Motor de Alertas & Notificações (Webhooks, WhatsApp, E-mail)          │

    │  • Algoritmos de Scoring:                                                │

    │      - Índice de Fidelidade Partidária (Voto vs. Orientação de Bancada)  │

    │      - Termômetro de Produtividade Parlamentar                           │

    │      - Detector de Anomalias em Notas Fiscais da Cota CEAP               │

    └──────────────────────────────────────────────────────────────────────────┘

                                       │

                                       ▼

    ┌──────────────────────────────────────────────────────────────────────────┐

    │                    FRONTEND: PORTAL WEB MODULAR                          │

    │  • Dashboard Executivo (Next.js / TypeScript / Tailwind CSS / ECharts)   │

    │  • Módulo 1: "Radar Parlamentar 360°"                                    │

    │  • Módulo 2: "Auditor CEAP & Fornecedores Suspeitos"                     │

    │  • Módulo 3: "Mapa de Votações & Fidelidade"                             │

    │  • Módulo 4: "Ficha Limpa & Checagem CNJ"                                │

    │  • Módulo 5: "Termômetro de Transparência Pública (PNTP)"                │

    └──────────────────────────────────────────────────────────────────────────┘

```



---



## 3. Os 5 Grandes Módulos do Sistema



### Módulo 1: Perfil Parlamentar 360° (Dossiê Completo)= Raio-X em Tempo Real:** Biografia, patrimônio declarado, cargos em comissões (órgãos), presença em plenário e discursos taquigráficos. Mapa de Influência:** Em quais frentes parlamentares e grupos interparlamentares atua (via endpoints `/deputados/{id}/frentes` e `/grupos`). Histórico de Mandatos:** Mudanças de partido, afastamentos, suplências e cargos eletivos anteriores (`/mandatosExternos`). - SEM RESUMIR NADA, PENSE GRANDE



### Módulo 2: Auditor da Cota Parlamentar (CEAP) & Fornecedores

* **Varredura de Despesas:** Acompanhamento mês a mês com gráficos de linha e categorias de gastos (passagens, combustíveis, consultorias).

* **Detecção de Padrões:** Identificação de fornecedores concentradores (CNPJs recorrentes que recebem verbas de múltiplos parlamentares).

* **Cruzamento com Licitações do Senado:** Confrontação com os dados de `licitacoes.csv` para checar se empresas prestadoras de serviço também possuem contratos públicos de grande porte.



### Módulo 3: Painel de Votações, Ementas e Fidelidade Partidária

* **Placar do Plenário:** Visualização interativa da bancada de deputados em votações nominais (Sim, Não, Obstrução, Abstenção).

* **Índice de Dissidência:** Cálculo matemático comparando o voto do parlamentar com a orientação oficial da liderança do partido (`/votacoes/{id}/orientacoes` vs `/votacoes/{id}/votos`).

* **Rastreador de Tramitação:** Linha do tempo visual do andamento de Projetos de Lei e PECs, com alertas quando uma matéria muda de comissão.



### Módulo 4: Compliance Jurídico & Ficha Limpa (Integração CNJ)

* **Checagem CNCIAI:** Consulta automatizada ao WebService de Improbidade Administrativa do CNJ para averiguar se há condenações ativas que geram inelegibilidade.

* **Consulta DataJud:** Extração estruturada baseada no modelo MTD v1.2 do CNJ para identificar processos públicos em andamento associados ao CPF ou nome dos parlamentares.



### Módulo 5: Observatório da Transparência Municipal e Estadual (PNTP 2025)

* **Auditoria Nacional:** Utilização da base de 338 MB do PNTP (ATRICON/TCU) já existente na pasta.

* **Classificação e Selos:** Consulta por município ou tribunal para verificar quais órgãos públicos cumprem os critérios legais da Lei de Acesso à Informação (LAI) e quais foram reprovados na auditoria.



---



## 4. Diferenciais Tecnológicos e Funcionalidades Inovadoras



1. **Inteligência Artificial Generativa (LLM) para Resumo de Leis:**

   * Utilizar modelos para transformar ementas legislativas herméticas de 50 páginas em resumos de 3 parágrafos em linguagem simples para o cidadão.

2. **Grafos de Relacionamento (Entity Graph):**

   * Gráfico visual de nós conectando: `Deputado -> Partido -> Doadores de Campanha -> Fornecedores de Cota -> Empresas Vencedoras de Licitações`.

3. **Alertas Cívicos Multicanal:**

   * O usuário "segue" um tema (ex: "Inteligência Artificial", "Saúde", "Reforma Tributária") ou um parlamentar e recebe no Telegram/WhatsApp resumos das votações semanais.



---



## 5. Roteiro de Implementação (Roadmap)



### Fase 1: MVP Robusto & Infraestrutura Base 

* Construção do Dashboard Web Integrado com suporte a busca instantânea.

* Integração completa com a API REST v2 da Câmara (Deputados, Despesas CEAP, Proposições e Votações).

* Interface responsiva com gráficos interativos (ECharts / Chart.js).



### Fase 2: Módulo Financeiro & Rastreamento de Fornecedores 

* Processamento dos arquivos CSV de licitações e dos dados estáticos da CEAP.

* Construção do algoritmo de detecção de anomalias em gastos.



### Fase 3: Módulo Jurídico & Eleitoral

* Conectores para o WebService SOAP do CNJ (CNCIAI) e endpoints públicos do DataJud.

* Ingestão das bases de processos eleitorais e prestação de contas partidárias 2026 do TSE.



### Fase 4: Observatório PNTP & Camada de Inteligência Artificial

* Ingestão da base de 338 MB de auditoria da transparência.

* Integração com assistente inteligente para análise automatizada de proposições.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/13fab289-7a2c-42b8-9f3c-fb397fc812e9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
