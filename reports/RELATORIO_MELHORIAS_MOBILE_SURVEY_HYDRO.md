# RelatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio de melhorias mobile

## Resumo
Foi aplicada uma camada de otimizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o mobile sobre a landing estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tica da Survey Hydro, preservando a identidade visual desktop. O caminho inicial deixou de carregar GSAP, ScrollTrigger e o bundle de motion/React que nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o era montado pela pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡gina pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºblica.

## Stack encontrada
HTML estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡tico, CSS e JavaScript vanilla no runtime, com esbuild no build. O repositÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio tambÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©m contÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©m fontes experimentais React/Three.js.

## Problemas identificados
- Menu mobile expunha a lista completa de serviÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§os.
- Tema ocupava espaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§o com labels textuais.
- AnimaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes e listeners globais dependiam de bibliotecas pesadas nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o usadas pela pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡gina.
- FormulÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o tinha status acessÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­vel nem prevenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºltiplos envios.
- Cards de atividades nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o eram um accordion semÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ntico.
- Havia custo permanente por `will-change` e atualizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de header a cada scroll.

## AlteraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes aplicadas
- Menu mobile compacto com fechamento por link, Escape, clique fora e bloqueio de scroll.
- Item ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºnico de ServiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§os no header; a lista detalhada permanece na seÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o Atividades.
- Tema com ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cones, `aria-pressed`, persistÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia em `localStorage` e preferÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia do sistema.
- Atividades convertidas em accordion com `details/summary`, um item aberto por vez.
- Reveal com `IntersectionObserver`, sem GSAP/ScrollTrigger e sem estado React durante scroll.
- Header com `requestAnimationFrame` e listener passivo.
- FormulÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio com autocomplete/inputmode, validaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o nativa, estado de envio, prevenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de duplicidade e feedback `aria-live`.
- Hero mobile compacto, CTAs empilhados, galeria decorativa ocultada abaixo de 680px e WhatsApp respeitando safe area.
- Foco visÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­vel, ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡reas tocÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡veis, `scroll-margin-top`, `content-visibility` abaixo da dobra e suporte a `prefers-reduced-motion`.
- `will-change` permanente neutralizado nos componentes visuais.

## Arquivos modificados
- `index.html`
- `src/app.js`
- `src/styles.css`
- `reports/RELATORIO_MELHORIAS_MOBILE_SURVEY_HYDRO.md`

## Bibliotecas removidas
Do HTML inicial: GSAP, ScrollTrigger e `assets/motion-enhancements.js`. Nenhuma dependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia nova foi adicionada.

## Resultados Lighthouse mobile
- Performance: 100
- Accessibility: 96
- Best Practices: 96
- SEO: 100
- LCP: 1,2s
- CLS: 0
- TBT: 0ms

RelatÃ³rio gerado contra o build servido localmente em 14/07/2026.

## Testes executados
- `npm run build` â€” passou.
- `npm run lint` â€” passou sem warnings.
- `npm run typecheck` â€” passou.
- `npm test` â€” 3 testes passaram.
- `npm run lighthouse:mobile` â€” passou com as mÃ©tricas acima.
## Riscos e pendÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias
- O formulÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡rio continua sendo uma simulaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o local; falta definir o endpoint real.
- A validaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o manual em dispositivos fÃƒÆ’Ã‚Â­sicos Chrome Android/Safari iOS continua recomendada.
- Decidir se as fontes React/Three.js experimentais devem sair do repositÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³rio e do build em uma limpeza posterior.

## EvidÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias
Build concluÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­do em 13/07/2026. A pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡gina pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºblica nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o referencia mais GSAP, ScrollTrigger ou `assets/motion-enhancements.js`.
## Correção complementar — desktop e codificação

- Corrigido o texto duplamente codificado no header, tema, accordion e feedback do formulário.
- Ícones de tema passaram a usar entidades HTML estáveis.
- Logo validado no desktop: visível com 142px.
- ssets/motion-enhancements.js voltou a carregar somente em ponteiro fino e sem movimento reduzido.
- Mobile continua sem o bundle pesado e sem o fundo decorativo do hero.
- Lighthouse desktop: Performance 96, Accessibility 100, Best Practices 96, SEO 100, LCP 1,2s.
