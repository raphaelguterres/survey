# RelatÃƒÆ’Ã‚Â³rio de melhorias mobile

## Resumo
Foi aplicada uma camada de otimizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o mobile sobre a landing estÃƒÆ’Ã‚Â¡tica da Survey Hydro, preservando a identidade visual desktop. O caminho inicial deixou de carregar GSAP, ScrollTrigger e o bundle de motion/React que nÃƒÆ’Ã‚Â£o era montado pela pÃƒÆ’Ã‚Â¡gina pÃƒÆ’Ã‚Âºblica.

## Stack encontrada
HTML estÃƒÆ’Ã‚Â¡tico, CSS e JavaScript vanilla no runtime, com esbuild no build. O repositÃƒÆ’Ã‚Â³rio tambÃƒÆ’Ã‚Â©m contÃƒÆ’Ã‚Â©m fontes experimentais React/Three.js.

## Problemas identificados
- Menu mobile expunha a lista completa de serviÃƒÆ’Ã‚Â§os.
- Tema ocupava espaÃƒÆ’Ã‚Â§o com labels textuais.
- AnimaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes e listeners globais dependiam de bibliotecas pesadas nÃƒÆ’Ã‚Â£o usadas pela pÃƒÆ’Ã‚Â¡gina.
- FormulÃƒÆ’Ã‚Â¡rio nÃƒÆ’Ã‚Â£o tinha status acessÃƒÆ’Ã‚Â­vel nem prevenÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de mÃƒÆ’Ã‚Âºltiplos envios.
- Cards de atividades nÃƒÆ’Ã‚Â£o eram um accordion semÃƒÆ’Ã‚Â¢ntico.
- Havia custo permanente por `will-change` e atualizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de header a cada scroll.

## AlteraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes aplicadas
- Menu mobile compacto com fechamento por link, Escape, clique fora e bloqueio de scroll.
- Item ÃƒÆ’Ã‚Âºnico de ServiÃƒÆ’Ã‚Â§os no header; a lista detalhada permanece na seÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Atividades.
- Tema com ÃƒÆ’Ã‚Â­cones, `aria-pressed`, persistÃƒÆ’Ã‚Âªncia em `localStorage` e preferÃƒÆ’Ã‚Âªncia do sistema.
- Atividades convertidas em accordion com `details/summary`, um item aberto por vez.
- Reveal com `IntersectionObserver`, sem GSAP/ScrollTrigger e sem estado React durante scroll.
- Header com `requestAnimationFrame` e listener passivo.
- FormulÃƒÆ’Ã‚Â¡rio com autocomplete/inputmode, validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o nativa, estado de envio, prevenÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de duplicidade e feedback `aria-live`.
- Hero mobile compacto, CTAs empilhados, galeria decorativa ocultada abaixo de 680px e WhatsApp respeitando safe area.
- Foco visÃƒÆ’Ã‚Â­vel, ÃƒÆ’Ã‚Â¡reas tocÃƒÆ’Ã‚Â¡veis, `scroll-margin-top`, `content-visibility` abaixo da dobra e suporte a `prefers-reduced-motion`.
- `will-change` permanente neutralizado nos componentes visuais.

## Arquivos modificados
- `index.html`
- `src/app.js`
- `src/styles.css`
- `reports/RELATORIO_MELHORIAS_MOBILE_SURVEY_HYDRO.md`

## Bibliotecas removidas
Do HTML inicial: GSAP, ScrollTrigger e `assets/motion-enhancements.js`. Nenhuma dependÃƒÆ’Ã‚Âªncia nova foi adicionada.

## Resultados Lighthouse mobile
- Performance: 100
- Accessibility: 96
- Best Practices: 96
- SEO: 100
- LCP: 1,2s
- CLS: 0
- TBT: 0ms

Relatório gerado contra o build servido localmente em 14/07/2026.

## Testes executados
- `npm run build` — passou.
- `npm run lint` — passou sem warnings.
- `npm run typecheck` — passou.
- `npm test` — 3 testes passaram.
- `npm run lighthouse:mobile` — passou com as métricas acima.
## Riscos e pendÃƒÆ’Ã‚Âªncias
- O formulÃƒÆ’Ã‚Â¡rio continua sendo uma simulaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o local; falta definir o endpoint real.
- A validaÃƒÂ§ÃƒÂ£o manual em dispositivos fÃƒÂ­sicos Chrome Android/Safari iOS continua recomendada.
- Decidir se as fontes React/Three.js experimentais devem sair do repositÃƒÆ’Ã‚Â³rio e do build em uma limpeza posterior.

## EvidÃƒÆ’Ã‚Âªncias
Build concluÃƒÆ’Ã‚Â­do em 13/07/2026. A pÃƒÆ’Ã‚Â¡gina pÃƒÆ’Ã‚Âºblica nÃƒÆ’Ã‚Â£o referencia mais GSAP, ScrollTrigger ou `assets/motion-enhancements.js`.