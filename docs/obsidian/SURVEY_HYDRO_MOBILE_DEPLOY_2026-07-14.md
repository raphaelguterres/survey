---
title: Survey Hydro — melhoria mobile e deploy
project: Survey Hydro
status: publicado
วันที่: 2026-07-14
---

# Survey Hydro — melhoria mobile e deploy

## Publicação

- Branch: `agent/mobile-performance-deploy`
- Commit: `2c543a9` — Improve mobile performance and quality gates
- GitHub: https://github.com/raphaelguterres/survey/tree/agent/mobile-performance-deploy
- Vercel produção: https://survey-landing-ashy.vercel.app
- Deployment: https://survey-landing-lpy75ykmv-raphaelguterres-projects.vercel.app
- Status Vercel: READY

## Alterações de experiência mobile

- Header reduzido para aproximadamente 60–64px.
- Menu mobile compacto, sem lista longa de serviços.
- Fechamento do menu por link, Escape, clique fora e restauração do scroll.
- Tema claro/escuro com ícones, estado acessível e persistência em `localStorage`.
- Hero com CTA principal e secundário em layout mobile compacto.
- Galeria decorativa ocultada em telas pequenas para reduzir custo de LCP.
- Serviços convertidos em accordion semântico com `details/summary`.
- Clientes em grade responsiva de duas colunas, com fallback para uma coluna em telas estreitas.
- Campos do formulário com fonte de 16px, autocomplete, inputmode e feedback acessível.
- WhatsApp com tamanho adequado e respeito à safe area inferior.
- Foco visível e áreas tocáveis mínimas.

## Performance e código

- GSAP e ScrollTrigger removidos do caminho inicial.
- `assets/motion-enhancements.js` removido do HTML público.
- Reveal substituído por `IntersectionObserver`.
- Scroll do header usa listener passivo e `requestAnimationFrame`.
- Movimento reduzido respeitado via `prefers-reduced-motion`.
- `will-change` permanente neutralizado nos elementos visuais.
- `content-visibility` aplicado abaixo da dobra.
- Nenhuma dependência nova de runtime foi adicionada.

## Qualidade configurada

- ESLint em `eslint.config.js`.
- Typecheck em `tsconfig.json`.
- Testes nativos Node em `tests/quality.test.js`.
- Lighthouse automatizado em `scripts/run-lighthouse.mjs`.
- Scripts adicionados ao `package.json`: `lint`, `typecheck`, `test` e `lighthouse:mobile`.

## Validação final

| Verificação | Resultado |
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

## Pendências

- O formulário ainda simula o envio localmente; falta conectar o endpoint real.
- Recomenda-se validar manualmente em Chrome Android e Safari iOS físicos.
- As fontes experimentais React/Three.js continuam no repositório, embora não sejam carregadas pela página pública.

## Tags sugeridas para o Obsidian

#survey-hydro #mobile #performance #lighthouse #vercel #deploy #frontend