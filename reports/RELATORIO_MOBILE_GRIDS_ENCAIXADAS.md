# Relatório — Mobile com grids encaixadas

## Objetivo

Transformar a composição mobile da Survey Hydro em uma interface editorial premium, com grid global, mosaico de artes, CTAs compactos e alinhamento consistente entre as seções.

## Diagnóstico visual

A Fase 3 já tinha CTAs compactos, chips menores e galeria horizontal. O principal ponto de refinamento era substituir a leitura linear por uma composição modular específica para celular.

## Grid global

Foi criado um sistema mobile com padding, gap, raios e escala de espaçamento compartilhados. A margem lateral passou a ser usada também no mosaico de campo, clientes e formulário.

## Hero

O hero mobile usa hero-mobile-grid, mantendo o desktop intacto. O conteúdo ocupa a largura completa da grid e os CTAs seguem a mesma linha modular do bloco principal.

## CTAs

- Superfície visual aproximada de 36px.
- Área tocável preservada em 44px.
- Lado a lado a partir de 360px.
- Quebra controlada abaixo de 360px.
- CTA principal limitado a 190px e secundário a 155px.
- Setas próximas ao texto, sem distribuição artificial de espaço.
- Interação curta no estado active, sem JavaScript adicional.

## Chips

Os três chips formam uma grade 2+1, com mesma altura por linha, padding consistente, ellipsis para textos longos e alinhamento na margem global.

## Mosaico de artes

A galeria mobile foi convertida para grid editorial:

- Topografia ocupa a coluna esquerda e duas linhas.
- Hidrometria ocupa a coluna direita superior.
- Campo ocupa a coluna direita inferior.
- Grid com colunas 1.15fr 0.85fr, gap compartilhado e altura responsiva.
- Imagens mantêm WebP, fallback JPG, lazy loading, decoding assíncrono e object-position individual.
- O desktop continua usando o stack original dentro do hero.

## Quem Somos

A seção recebeu a classe about-grid e passou a seguir a mesma estrutura de alinhamento do sistema mobile, sem inventar métricas ou conteúdo.

## Serviços

O accordion mantém semântica de details/summary, com estrutura fixa de três colunas: marcador, nome e indicador. Os itens usam gap e altura mínima consistentes.

## Clientes

A grade de clientes virou uma composição 2x2 real, com cards de mesma altura, padding uniforme e bordas alinhadas. Abaixo de 360px, passa a uma coluna para preservar leitura.

## Timeline

Os três cards de processo usam process-grid com coluna numérica e linha vertical contínua entre as etapas.

## Formulário

O formulário usa duas colunas quando há espaço. Demanda, resumo, envio e status ocupam a largura completa. Abaixo de 360px, o layout pode colapsar naturalmente sem reduzir a legibilidade dos campos.

## Sistema de espaçamento

Foram adicionadas variáveis mobile para padding, gaps e escala de espaços entre 4px e 56px.

## Sistema de raios

Foram padronizados raios pequenos, médios e grandes, com cards de imagem usando 12px, CTAs/chips usando 8px e cards de conteúdo usando 12px.

## Acessibilidade

- Áreas tocáveis dos CTAs permanecem em 44px.
- Foco visível preservado.
- Ordem do DOM mantida.
- Accordion semântico preservado.
- Textos alternativos das imagens mantidos.
- Contraste e leitura dos títulos sobre overlay preservados.
- Nenhum texto depende de ícones para entendimento.

## Performance

A implementação usa CSS Grid, media queries, aspect-ratio, object-fit e assets já otimizados. Não foram adicionadas bibliotecas, masonry, slider, listeners contínuos de resize ou JavaScript para posicionamento.

## Arquivos alterados

- index.html
- src/styles.css
- tests/quality.test.js
- reports/RELATORIO_MOBILE_GRIDS_ENCAIXADAS.md
- reports/screenshots/grid-mobile-320.png
- reports/screenshots/grid-mobile-360.png
- reports/screenshots/grid-mobile-390.png
- reports/screenshots/grid-mobile-430.png
- reports/screenshots/grid-mobile-dark.png
- reports/screenshots/grid-mobile-light.png
- reports/screenshots/grid-desktop-regression.png
- reports/lighthouse-mobile-after.report.html
- reports/lighthouse-mobile-after.report.json

## Lighthouse antes

Referência da Fase 3: Performance 100, Accessibility 96, Best Practices 96, SEO 100, LCP 1,7s, CLS 0 e TBT 0ms.

## Lighthouse depois

Performance 100, Accessibility 96, Best Practices 96, SEO 100, LCP 1,9s, FCP 1,1s, CLS 0 e TBT 0ms.

## Testes executados

- npm run lint — passou.
- npm run typecheck — passou.
- npm test — 7/7 testes passaram.
- npm run build — passou.
- npm run lighthouse:mobile — passou e gerou os relatórios finais.

## Evidências visuais

Capturas geradas para 320x568, 360x800, 390x844, 430x932, tema escuro, tema claro e regressão desktop em 1280x800.

A inspeção estrutural confirmou ausência de overflow horizontal nos breakpoints mobile verificados. Em 320px, os CTAs permanecem tocáveis e compactos; em 360px ou mais, ficam lado a lado.

## Regressão desktop

O desktop permanece com a composição original de artes, fundo aquático e animações condicionadas a viewport desktop e pointer fine.

## Pendências

- Validar fisicamente em Safari iOS e Chrome Android.
- Confirmar endpoint real de envio do formulário quando estiver disponível.