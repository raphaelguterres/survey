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
