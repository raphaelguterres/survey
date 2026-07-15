# Relatório — Auditoria Visual Mobile (Survey Hydro)

## Stack encontrada

- Site estático (HTML/CSS/JS puro), sem framework de build para o markup.
- `index.html` + `src/styles.css` como fonte principal de layout.
- `src/hero3d.js` e `src/motion-enhancements.jsx` são bundlados via `esbuild` (`npm run build`) para `assets/hero3d.js` e `assets/motion-enhancements.js`.
- Servidor local: `python -m http.server 8123` (config em `.claude/launch.json`, nome `static`). O script `npm run dev` do `package.json` aponta para a porta 4174, mas não foi usado — o launch.json já tinha uma configuração funcional na 8123.
- Testes: `node tests/quality.test.js` (Node test runner nativo, sem Playwright instalado no projeto).
- Lint: ESLint 10. Typecheck: TypeScript 7 (`tsc --pretty false`, apenas para `src/app.js`/config). Lighthouse: `scripts/run-lighthouse.mjs`.

## Branch

`agent/mobile-visual-life` (limpa no início da sessão, sincronizada com o remoto).

## Ferramenta de auditoria visual

O Playwright MCP não estava instalado nem foi necessário instalar: o ambiente já dispõe de um Browser pane (Chromium controlado) equivalente. **Durante toda a sessão, a captura de screenshot desse Browser pane esteve indisponível** (timeout em qualquer página, inclusive `example.com`, isolando o problema como uma falha de infraestrutura da ferramenta, não do projeto). Leitura de DOM, console, rede e execução de JavaScript no navegador funcionaram normalmente e foram usados como substituto:

- `read_page` / `get_page_text` para estrutura e conteúdo.
- `javascript_tool` para medir `getBoundingClientRect()`, `getComputedStyle()` e inspecionar `document.styleSheets` (cascata CSS real, regra por regra) em 320/360/390/430/1280px.

Isso permitiu diagnosticar e confirmar numericamente os problemas e a correção, mas **não há screenshots em pixel desta rodada**. Ver pendências.

## Diagnóstico

| Problema | Viewport | Elemento | Causa provável | Arquivo | Seletor | Correção proposta | Prioridade |
|---|---|---|---|---|---|---|---|
| Mosaico de campo não forma "1 grande + 2 empilhadas": o card de Topografia ocupava só 1 linha (176px de 360px em 320px, ~176 de 429 em 390px), deixando um vão vazio abaixo dele na coluna 1 | 320–430px | `.mobile-field-card--topografia` dentro de `.mobile-field-grid` | Regra legada `.mobile-field-gallery .photo-card:first-of-type { grid-row: auto; min-height: 0; }` (resquício da galeria em carrossel horizontal da "Fase 3") tinha especificidade maior (3 seletores de classe) que `.mobile-field-card--topografia { grid-row: 1 / 3 }` (1 classe), então vencia a cascata mesmo definida antes no arquivo | `src/styles.css` | linha ~530 (removida) e linhas ~726-737 (renomeadas) | Alta |
| Risco correlato: as regras `--hidrometria`/`--campo` também tinham especificidade insuficiente frente a várias gerações de regras antigas `.photo-card:first-child` / `.photo-card:not(:first-child)` (herdadas do stack desktop, com pelo menos 5 blocos de `grid-row`/`height` divergentes em breakpoints 420/680/760/980px). O posicionamento correto delas era coincidência do algoritmo de auto-placement do grid, não da regra pretendida | 320–430px | `.mobile-field-card--hidrometria`, `.mobile-field-card--campo` | Mesma causa-raiz acima | `src/styles.css` | linhas ~730-737 | Alta (preventivo) |

Não foram encontradas outras quebras estruturais nos pontos verificados (overflow horizontal, grid de chips 2+1, CTAs lado a lado, clientes 2×2, regressão desktop) — ver seção de verificação abaixo.

## Correção implementada

1. Removida a regra morta `.mobile-field-gallery .photo-card:first-of-type { grid-row: auto; min-height: 0; }` (era exclusiva da galeria antiga em carrossel, sem uso funcional restante).
2. As três regras de posicionamento do mosaico passaram a ser escopadas por `.mobile-field-grid` (`.mobile-field-grid .mobile-field-card--topografia/--hidrometria/--campo`), elevando a especificidade para empatar com as regras legadas remanescentes do stack desktop — e, por estarem entre as últimas do arquivo, vencem o empate de cascata em qualquer viewport ≤ 767px, sem tocar/remover código usado pelo desktop.

Nenhuma biblioteca nova, JavaScript de posicionamento ou alteração de estrutura HTML foi necessária — a correção é puramente CSS (especificidade de seletor).

## Verificação (medição de geometria via DOM, sem screenshot)

| Viewport | `grid-row` computado (Topografia) | Altura Topografia | Altura total mosaico | Overflow horizontal |
|---|---|---|---|---|
| 320×568 | `1 / 3` | 360px | 360px | Não |
| 360×800 | `1 / 3` | 396px (medido antes do fix: 193px) | 396px | Não |
| 390×844 | `1 / 3` | 429px (antes: 210px) | 429px | Não |
| 430×932 | `1 / 3` | 473px | 473px | Não |
| 1280×800 (desktop) | n/a — usa `.desktop-photo-stack`, inalterado | `.photo-card:first-child` segue 574px (igual ao container) | — | Não |

Outros pontos conferidos via geometria computada:
- CTAs: 44px de área tocável, superfície visual 40px, fonte ~10.9px, `justify-content: center` (não `space-between`), lado a lado a partir de 360px — consistente com o pedido do documento.
- Chips: grade 2+1 confirmada (dois chips de 144px + um chip de largura total).
- Clientes: 2×2 a partir de 360px (`grid-template-columns: repeat(2, ...)`), 1 coluna abaixo de 360px (comportamento já documentado em fase anterior).
- `.mobile-field-gallery` fica `display:none` e `.desktop-photo-stack` fica `display:grid` em 1280px — nenhum estilo mobile vazou para desktop.

## Testes executados

- `npm run lint` — ✅ passou.
- `npm run typecheck` — ✅ passou.
- `npm test` — ✅ 9/9 (o arquivo de testes já cresceu desde o relatório anterior, que citava 6/6 e 7/7 em fases passadas).
- `npm run build` — ✅ passou (`assets/hero3d.js` 927.9kb, `assets/motion-enhancements.js` 290.8kb).
- `npm run lighthouse:mobile` — ✅ rodou sem erro, mas com números abaixo do historicamente relatado (ver abaixo).

## Lighthouse

| Métrica | Relatado anteriormente (fases passadas) | Medido nesta sessão (com a correção) | Medido nesta sessão (baseline, sem a correção, via `git stash`) |
|---|---:|---:|---:|
| Performance | 100 | 81 | 81 |
| Accessibility | 96 | 96 | 96 |
| Best Practices | 96 | 96 | 96 |
| SEO | 100 | 100 | 100 |
| LCP | 1,7–1,9s | 5,2s | 5,1s |
| FCP | — | 1,2s | 1,2s |
| CLS | 0 | 0 | 0 |
| TBT | 0ms | 0ms | 0ms |

**A queda de Performance/LCP é pré-existente neste ambiente, não causada pela correção**: rodei o Lighthouse duas vezes com a correção aplicada (81/5,2s ambas as vezes) e uma vez com `git stash` (código original, sem a correção — 81/5,1s). Os números são idênticos com e sem a mudança, isolando a variação como ambiental (carga da máquina local, contenção de recursos ou diferença de sessão do Chrome) e não como regressão de código. Vale re-medir em um ambiente mais controlado antes de decidir sobre deploy com base nesse número.

## Regressão desktop

Confirmada via geometria computada: `.desktop-photo-stack` continua em `display:grid` com o card de Topografia ocupando a altura total do stack (574px em 1280px de viewport), `.mobile-field-gallery` continua oculta em desktop, e nenhuma das classes `.mobile-field-grid`/`.mobile-field-card--*` (escopadas dentro de `@media (max-width: 767px)`) atinge o layout desktop.

## Arquivos alterados

- `src/styles.css`
- `reports/RELATORIO_AUDITORIA_VISUAL_PLAYWRIGHT_MOBILE.md` (este relatório)
- `reports/lighthouse-mobile-after.report.html` / `.json` (regenerados)

## Pendências

- **Screenshots em pixel não foram gerados nesta rodada** — a ferramenta de captura do Browser pane esteve indisponível durante toda a sessão (confirmado com teste em página externa). A correção foi validada por medição de geometria via DOM (`getBoundingClientRect`, `getComputedStyle`, inspeção de `document.styleSheets`), não por inspeção visual em pixel. Recomendo repetir a captura visual (`before`/`after`) assim que a ferramenta voltar, antes de considerar o item "aprovado" pelos critérios de aceite do documento original, que exigem evidência visual.
- Investigar por que o Lighthouse local está reportando Performance 81 / LCP 5,2s neste ambiente vs. os 100 / 1,7-1,9s de fases anteriores — parece ambiental (não é regressão desta mudança, conforme comparação com/sem a correção acima), mas merece nova medição em máquina/sessão limpa.
- Validar fisicamente em Safari iOS e Chrome Android (já pendente em relatórios anteriores).
- Conectar o formulário a um endpoint real (fora de escopo deste refinamento visual).

## Decisão sobre deploy

Não foi feito deploy, merge ou commit. A correção está apenas no working tree (não commitada) da branch `agent/mobile-visual-life`, aguardando autorização explícita para qualquer ação adicional (commit, push, merge ou deploy).
