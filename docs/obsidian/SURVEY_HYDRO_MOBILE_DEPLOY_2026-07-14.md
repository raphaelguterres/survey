---
title: Survey Hydro â€” melhoria mobile e deploy
project: Survey Hydro
status: publicado
à¸§à¸±à¸™à¸—à¸µà¹ˆ: 2026-07-14
---

# Survey Hydro â€” melhoria mobile e deploy

## PublicaÃ§Ã£o

- Branch: `agent/mobile-performance-deploy`
- Commit: `2c543a9` â€” Improve mobile performance and quality gates
- GitHub: https://github.com/raphaelguterres/survey/tree/agent/mobile-performance-deploy
- Vercel produÃ§Ã£o: https://survey-landing-ashy.vercel.app
- Deployment: https://survey-landing-lpy75ykmv-raphaelguterres-projects.vercel.app
- Status Vercel: READY

## AlteraÃ§Ãµes de experiÃªncia mobile

- Header reduzido para aproximadamente 60â€“64px.
- Menu mobile compacto, sem lista longa de serviÃ§os.
- Fechamento do menu por link, Escape, clique fora e restauraÃ§Ã£o do scroll.
- Tema claro/escuro com Ã­cones, estado acessÃ­vel e persistÃªncia em `localStorage`.
- Hero com CTA principal e secundÃ¡rio em layout mobile compacto.
- Galeria decorativa ocultada em telas pequenas para reduzir custo de LCP.
- ServiÃ§os convertidos em accordion semÃ¢ntico com `details/summary`.
- Clientes em grade responsiva de duas colunas, com fallback para uma coluna em telas estreitas.
- Campos do formulÃ¡rio com fonte de 16px, autocomplete, inputmode e feedback acessÃ­vel.
- WhatsApp com tamanho adequado e respeito Ã  safe area inferior.
- Foco visÃ­vel e Ã¡reas tocÃ¡veis mÃ­nimas.

## Performance e cÃ³digo

- GSAP e ScrollTrigger removidos do caminho inicial.
- `assets/motion-enhancements.js` removido do HTML pÃºblico.
- Reveal substituÃ­do por `IntersectionObserver`.
- Scroll do header usa listener passivo e `requestAnimationFrame`.
- Movimento reduzido respeitado via `prefers-reduced-motion`.
- `will-change` permanente neutralizado nos elementos visuais.
- `content-visibility` aplicado abaixo da dobra.
- Nenhuma dependÃªncia nova de runtime foi adicionada.

## Qualidade configurada

- ESLint em `eslint.config.js`.
- Typecheck em `tsconfig.json`.
- Testes nativos Node em `tests/quality.test.js`.
- Lighthouse automatizado em `scripts/run-lighthouse.mjs`.
- Scripts adicionados ao `package.json`: `lint`, `typecheck`, `test` e `lighthouse:mobile`.

## ValidaÃ§Ã£o final

| VerificaÃ§Ã£o | Resultado |
|---|---|
| `npm run build` | passou |
| `npm run lint` | passou sem warnings |
| `npm run typecheck` | passou |
| `npm test` | 3 testes passaram |
| Lighthouse Performance | 100 |
| Lighthouse Accessibility | 96 |
| Lighthouse Best Practices | 96 |
| Lighthouse SEO | 100 |
| LCP mobile | 1,2s |
| CLS | 0 |
| TBT | 0ms |
| `npm audit` | 0 vulnerabilidades |

## Artefatos

- `reports/lighthouse-mobile-after.html`
- `reports/lighthouse-mobile-after.json`
- `reports/RELATORIO_MELHORIAS_MOBILE_SURVEY_HYDRO.md`

## PendÃªncias

- O formulÃ¡rio ainda simula o envio localmente; falta conectar o endpoint real.
- Recomenda-se validar manualmente em Chrome Android e Safari iOS fÃ­sicos.
- As fontes experimentais React/Three.js continuam no repositÃ³rio, embora nÃ£o sejam carregadas pela pÃ¡gina pÃºblica.

## Tags sugeridas para o Obsidian

#survey-hydro #mobile #performance #lighthouse #vercel #deploy #frontend
## Correção pós-deploy

- Corrigida a codificação quebrada no header e nos textos novos.
- Animações desktop reativadas de forma condicional via ssets/motion-enhancements.js.
- Desktop validado: Performance 96, Accessibility 100, Best Practices 96, SEO 100.
- Mobile validado: Performance 100, Accessibility 96, Best Practices 96, SEO 100.


## Fase 2 — Mais vida no mobile (2026-07-14)

- Branch: `agent/mobile-visual-life`.
- Hero ganhou selo técnico, chips de especialidade, CTAs com ícones e indicador Explore.
- Cards, accordion, clientes, formulário e WhatsApp receberam microinterações leves em CSS.
- `IntersectionObserver` e `prefers-reduced-motion` foram preservados.
- Desktop continua com logo/navegação e bundle motion; mobile não carrega o bundle pesado.
- Validação: lint, typecheck, testes 3/3 e build aprovados.
- Navegador: mobile 390x844 e desktop 1280px verificados; menu mobile abriu com `aria-expanded=true`.
- Lighthouse mobile: Performance 100, Accessibility 96, Best Practices 96, SEO 100, LCP 1.4 s, CLS 0, TBT 0 ms.
- Evidências: `reports/mobile-hero-phase2.png` e `reports/mobile-services-phase2.png`.
- Relatório detalhado: `reports/RELATORIO_MAIS_VIDA_MOBILE_SURVEY_HYDRO.md`.
## Diagnóstico do feedback visual (2026-07-14)

- A inspeção no preview mobile 390x844 confirmou que os CTAs estão renderizando corretamente em largura total, com as setas dentro dos próprios links.
- O círculo preto sobre “Ver atividades” não pertence ao site: é o elemento `vercel-live-feedback`, widget automático de feedback da Vercel em deployments de preview (`z-index: 2147483647`).
- A publicação de produção foi escolhida para validação final sem esse overlay de preview.
- Evidência visual: screenshot capturado no preview e inspeção DOM via `document.elementsFromPoint`.
## Cards clean sem ícones (2026-07-14)

- Removidos o `+` do accordion e a seta decorativa dos cards de atividades.
- Removido o recuo/painel lateral ao abrir o conteúdo, mantendo o texto expansível acessível.
- Hover preservado apenas com borda e sombra discretas.
- Testes atualizados para proteger o visual sem ícones.
- Validação: lint, typecheck, 5/5 testes e build aprovados.
## Code Review e Correções (2026-07-15)

- Branch: `agent/mobile-uiux-senior-audit` — commit `798c5ce`.
- Review de alta profundidade via 7 agentes paralelos sobre o diff `main...HEAD`.
- 10 bugs encontrados e corrigidos (7 confirmados, 3 plausíveis).
- Bugs críticos: `classList.add('.is-hidden')` com ponto (scroll cue quebrado), indicadores +/− do accordion mortos por regra CSS tardia, `motionDisabled()` desligando animações em tablets com `pointer:coarse`.
- Acessibilidade: `aria-expanded` desincronizado com `:focus-within` no submenu de navegação — corrigido com `focusin`/`focusout`.
- CI: exit code do Lighthouse invertido com arquivo parcial — corrigido.
- Manutenção: `!important` em hero-actions consolidado, `window.innerWidth` snapshot substituído por `matchMedia`, null guards adicionados em `initializeContactForm` e `initializeNavigation`, flag `accordionBusy` no accordion.
- Validação: lint e typecheck aprovados.
- Nota completa: `SURVEY_HYDRO_CODE_REVIEW_2026-07-15.md` no vault do Obsidian.
