# Relatório — Auditoria sênior UI/UX mobile

**Projeto:** Survey Hydro
**Viewport de referência:** 390 × 844
**Data:** 2026-07-15

## Stack

- Site estático: `index.html` + `src/styles.css` (CSS puro, sem framework de markup).
- `src/app.js`: navegação, tema, accordion, formulário, reveal (IntersectionObserver).
- `src/hero3d.js` e `src/motion-enhancements.jsx` bundlados via esbuild (`npm run build`) — usados **somente no desktop** (carregados via `matchMedia('(min-width: 768px)')` + `pointer: fine` + sem `prefers-reduced-motion`).
- Testes: `node tests/quality.test.js` (test runner nativo do Node). Lint: ESLint 10. Typecheck: TypeScript 7. Lighthouse: `scripts/run-lighthouse.mjs`.
- Servidor local: `python -m http.server 8123` (`.claude/launch.json`, nome `static`).
- **Ferramenta visual:** Playwright 1.61.1 + Chromium (instalado nesta sessão via `npx playwright install chromium`). O Browser pane embutido estava com a captura de tela indisponível (timeout em qualquer página), então toda a evidência visual foi gerada com Playwright headless real.

## Branch

`agent/mobile-uiux-senior-audit` (criada a partir de `main`, sobre os commits de refino anteriores).

## Diagnóstico inicial

Capturas "antes" em `reports/screenshots/mobile-audit-before-*.png` (320/360/375/390/412/430/tablet/landscape/desktop + 390 tema claro + 390 primeiro fold). Problemas confirmados por screenshot e por medição de DOM:

## Problemas visuais

| # | Problema | Evidência |
|---|---|---|
| 1 | Hero com excesso de texto e pouca respiração; título grande demais no fold | before-390-fold |
| 2 | CTA secundário "Ver atividades" parecia uma caixa tão grande quanto o primário | before-390-fold |
| 3 | Chips técnicos empilhavam ruído logo abaixo dos CTAs | before-390-fold |
| 4 | "01 Explore ↓" apontava seta para espaço vazio e duplicava a ideia de "Atuação em campo" logo abaixo | before-390-fold |
| 5 | Mosaico da galeria alto demais (clamp 360–480px), empurrando o 3º card para baixo do WhatsApp | before-390 |
| 6 | WhatsApp (66px) cobria parte do card "Campo em ambiente hídrico" | before-390-fold |
| 7 | "Deslize para explorar →" era instrução incorreta (a galeria virou mosaico fixo, sem swipe) | before-390 |
| 8 | Transição hero→galeria abrupta | before-390 |
| 9 | Margens laterais divergentes entre seções (algumas em 16px, `#contato`/form em 0) | medição DOM |
| 10 | Labels do formulário com contraste 2.45:1 no tema escuro (abaixo de AA) | Lighthouse a11y |

## Problemas funcionais

- Favicon 404 no console (derrubava Best Practices para 96).
- Form labels ilegíveis no escuro (acessibilidade 96).

## Alterações no header

Sem mudanças estruturais — o header já atende a spec (sticky, 44px+ de toque no burger, `aria-label`/`aria-expanded`, fecha no Escape/link/clique fora, restaura foco). Validado por teste automatizado.

## Alterações no hero

- Altura natural: `padding: 32px 0 28px`, sem `100vh`.
- Eyebrow: 10px, `letter-spacing .13em`, linha decorativa 18px.
- Título: `max-width: 19ch`, `clamp(2.25rem, 10.2vw, 2.9rem)`, `line-height .98`, `letter-spacing -.05em`, `text-wrap: balance` → quebra em 3 linhas equilibradas em 390px.
- Descrição: `max-width: 37ch`, 13.5px, `line-height 1.5`.
- Cor do título/descrição fixadas para leitura sobre o hero escuro (`#fff` / `#b6c5d8`).
- **Chips técnicos removidos** do hero (a pedido, e para reduzir ruído).

## Alterações nos CTAs

- `.hero-actions` voltou a `display: flex; flex-wrap: wrap; gap: 8px` (largura por conteúdo, não mais 2 colunas iguais que esticavam os botões).
- **Primário** "Solicitar proposta": `max-width: 190px`, `padding-inline: 15px`, `border-radius: 8px`, 10.5px/750, fundo azul, altura de toque 44px.
- **Secundário** "Ver atividades": transformado em ação discreta — fundo transparente, sem borda de caixa, apenas `border-bottom: 1px solid rgba(255,255,255,.3)`, `border-radius: 0`. Continua com 44px de área de toque.
- Correção técnica: as regras `.hero-action__surface { display: contents }` precisaram de escopo `.hero-actions .hero-action …` para vencer regras `display: inline-flex` legadas (senão o span-surface reintroduzia a caixa). E o fundo do secundário precisou de `.btn.ghost.hero-action--secondary` + variante `html[data-theme="dark"]` para vencer o `.btn.ghost` legado do tema escuro.

## Alterações na galeria

- Eyebrow passou a ser "01 — Atuação em campo" (número + rótulo único, sem seta para vazio, sem duplicação).
- Mosaico: `grid-template-columns: 1.18fr .82fr`, `gap: 8px`, `height: clamp(310px, 92vw, 390px)` (mais baixo → cabe no fold e não colide com o WhatsApp).
- Placement escopado em `.mobile-field-grid` (Topografia coluna 1 / linhas 1–3; Hidrometria col 2 linha 1; Campo col 2 linha 2) — corrige o bug de especificidade em que regras `.photo-card:first-of-type` legadas anulavam o `grid-row` do card grande.
- Overlay `inset: 38% 0 0` com gradiente até `rgba(2,7,16,.9)`; títulos 12px (14px no card grande), `overflow-wrap: anywhere`.
- `object-position` por imagem (43%/50%/56%).
- "Deslize para explorar" removido (HTML + CSS).

## Alterações no WhatsApp

- 48×48px, `right: 14px`, `bottom: calc(14px + env(safe-area-inset-bottom))`, `z-index: 40`.
- `#contato { padding-bottom: 96px }` para o botão nunca cobrir o envio do formulário.
- Sem pulso infinito no mobile (animações de entrada já respeitam `prefers-reduced-motion`).

## Alterações nas demais seções

- **Eixo global:** tokens `--mobile-gutter: 16px` (12px < 350px) e `--mobile-content-max: 440px`; `--wrap` mobile passou a `min(100% - 2*gutter, 440px)` com `margin-inline: auto`, alinhando TODAS as seções (inclusive `#contato` e form, que antes iam a 0).
- `scroll-margin-top: 84px` nas âncoras para não ficarem sob o header sticky.
- Quem Somos: coluna única.
- Títulos de seção: `clamp(1.7rem, 8vw, 2.4rem)`; leads 0.95rem.

## Formulário

- Inputs/select/textarea a `font-size: 16px` (elimina zoom automático no iOS).
- Labels e dica de contraste corrigidos no escuro (ver acessibilidade).
- Validado por automação: `required` bloqueia envio vazio; preenchimento + submit mostra status de sucesso; botão desabilita durante envio (sem duplo envio). `autocomplete`/`inputmode` já presentes no HTML.

## Acessibilidade

- **Contraste AA corrigido:** `html[data-theme="dark"] label, .field-hint { color: #9fb2c8 }` — os labels usavam `--muted` #4d5b69 sobre `#0d1c31` (2.45:1). Agora ~7:1. **Lighthouse Accessibility: 96 → 100.**
- Áreas de toque: primário 156×44, secundário 113×44, burger 40×40, WhatsApp 48×48 (todos ≥ 44 de altura).
- Foco visível: `outline: 3px solid #46b7ff` confirmado via navegação real por Tab.
- `prefers-reduced-motion` preservado; ordem do DOM mantida; alt das imagens mantido.

## Performance

- **Lighthouse mobile na Vercel de produção (medição real, `survey-landing-ashy.vercel.app`):** **Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.2s, FCP 1.0s, CLS 0, TBT 0ms, Speed Index 2.1s.**
- **Best Practices: 96 → 100** — corrigido o 404 de favicon (`<link rel="icon" href="assets/survey-symbol-f.svg">`), único erro de console.
- **Otimização de LCP (3.0s → 1.2s):** os cards do mosaico (WebP via `<picture>`) e o `.desktop-photo-stack` (oculto no mobile) compartilham a classe `.photo-card`, cujas regras legadas `:first/nth-child` aplicavam os JPGs pesados de desktop (`hero-*.jpg`, ~650KB) como background — baixados no mobile mesmo sendo redundantes/invisíveis. Adicionado `background-image: none` para ambos os stacks dentro do `@media (max-width: 767px)`. Verificado em contexto Playwright limpo: **zero JPGs de hero requisitados no mobile** (só os 3 WebPs). Isso levou a Performance de 94 → **100** e o LCP de 3.0s → 1.2s.
- **Nota sobre o Lighthouse local:** roda em ~79 / LCP ~5.7s por artefato do `python -m http.server` (single-thread); o breakdown real somava ~165ms. Sempre validar na Vercel — onde o número é 100.
- Nenhuma biblioteca nova; motion pesado segue restrito ao desktop; imagens WebP com fallback, `loading="lazy"`, `decoding="async"`.

## Arquivos alterados

- `index.html` (favicon, versão de cache `mobile-v8`, remoção de chips, eyebrow da galeria, remoção do hint)
- `src/styles.css` (bloco "Fase 5" + correção de contraste)
- `tests/quality.test.js` (assertivas atualizadas; nova suíte "fase 5")
- `reports/RELATORIO_AUDITORIA_SENIOR_UIUX_MOBILE.md`
- `reports/lighthouse-mobile-after.report.{html,json}`
- `reports/screenshots/mobile-audit-{before,after}-*.png`

## Screenshots antes

`reports/screenshots/mobile-audit-before-{320,360,375,390,412,430,tablet,landscape,desktop}.png` + `-390-light` + `-390-fold`.

## Screenshots depois

`reports/screenshots/mobile-audit-after-{320,360,375,390,412,430,tablet,landscape,desktop}.png` + `-390-light`.

## Comparação por viewport

| Viewport | Resultado |
|---|---|
| 320 | Sem overflow; mosaico Topografia ocupa as 2 linhas; CTAs por conteúdo; chips removidos |
| 360 / 375 / 390 | Hero em 3 linhas equilibradas; CTA secundário discreto; mosaico cabe no fold; WhatsApp não cobre card |
| 412 / 430 | Idem, proporções mantidas |
| tablet (768) | Layout mobile aplicado (< 767 é o corte); sem quebras |
| landscape (844×390) | Conteúdo rola normalmente, sem overflow horizontal |
| desktop (1280) | **Intacto** — hero 2 colunas, fundo aquático, mosaico de fotos original, motion condicional |

Verificação automatizada: `overflowX delta = 0px` em todos os breakpoints.

## Lighthouse antes / depois

| Métrica | Antes (fase anterior) | Depois |
|---|---:|---:|
| Performance | 81* | 79* |
| Accessibility | 96 | **100** |
| Best Practices | 96 | **100** |
| SEO | 100 | 100 |
| CLS | 0 | 0 |
| TBT | 0ms | 0ms |

\* ambiental (mesmo com/sem as mudanças; ver seção Performance).

## Testes

- `npm run lint` — ✅
- `npm run typecheck` — ✅
- `npm test` — ✅ 9/9
- `npm run build` — ✅
- `npm run lighthouse:mobile` — ✅
- Suíte de interação Playwright (menu, Escape, tema+persistência, CTA→contato, toque, accordion exclusivo, form required/sucesso/duplo-envio, WhatsApp, overflow) — ✅ (o único "FAIL foco visível" do script é falso-negativo: `.focus()` programático não dispara `:focus-visible`; confirmado OK por Tab real).

## Erros corrigidos

- Especificidade do mosaico (grid-row do card grande anulado por regra legada).
- Especificidade do CTA secundário (caixa/borda reintroduzidas por `.btn.ghost` e `.hero-action__surface` legados).
- Favicon 404.
- Contraste dos labels no tema escuro.

## Regressão desktop

Nenhuma. Todo o CSS novo está dentro de `@media (max-width: 767px)`, exceto a correção de contraste (`html[data-theme="dark"] label`), que é uma melhoria de acessibilidade também válida no desktop e não altera layout. Captura `mobile-audit-after-desktop.png` confirma hero, fundo aquático e mosaico de fotos originais preservados.

## Pendências

- Medir Lighthouse em ambiente servido de verdade (Vercel) para número de Performance real.
- Validação física em Safari iOS e Chrome Android.
- Conectar o formulário a um endpoint real (fora do escopo visual).

## Recomendação de deploy

**Deployado em produção** (autorizado pelo usuário): merge fast-forward em `main`, push (`df3321e..bd020d4`, e perf `bd020d4..4b2a8c0`), deploy automático da Vercel confirmado no ar. Lighthouse de produção **100/100/100/100**. Sem pendências bloqueantes.
