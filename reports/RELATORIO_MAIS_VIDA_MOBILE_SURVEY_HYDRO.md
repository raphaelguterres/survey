# Relatório — Mais vida no mobile

## Objetivo
Adicionar personalidade, movimento e sensação premium à experiência mobile sem reintroduzir animações pesadas, bibliotecas novas ou trabalho contínuo durante o scroll.

## Branch
agent/mobile-visual-life

## Componentes alterados
- Hero: selo técnico, chips de especialidade, CTAs com ícones e indicador Explore.
- Navegação: indicador de scroll que desaparece no primeiro scroll.
- Cards, serviços e clientes: borda ativa, highlight, profundidade e feedback de toque.
- Accordion: estado aberto mais claro e ícone com rotação curta.
- Formulário: foco com realce técnico e feedback de pressão.
- WhatsApp: entrada discreta e anel único.

## Animações adicionadas
- Entrada coordenada do hero em até 560ms com stagger de até 60ms.
- Entrada existente por IntersectionObserver preservada e executada uma vez.
- Microinterações com transform/opacity e sem listeners de scroll por frame para animação visual.

## Microinterações adicionadas
- Chips respondem ao toque com escala de 0.98.
- CTAs deslocam seus ícones e têm estado pressionado.
- Cards e clientes respondem ao toque.
- Accordion altera borda e indicador do item aberto.

## Melhorias visuais
- Tokens centralizados de motion.
- Divisores compactos com referência técnica Survey Hydro.
- Paleta existente preservada: azul, água e contraste institucional.

## Regras de reduced motion
- `prefers-reduced-motion: reduce` desativa keyframes e reduz transições.
- Hero fica estático e o indicador de scroll permanece acessível.
- Bundle de animação pesado continua restrito a ponteiro fino/desktop.

## Arquivos modificados
- `index.html`
- `src/app.js`
- `src/styles.css`
- `reports/mobile-hero-phase2.png`
- `reports/mobile-services-phase2.png`

## Resultado dos testes
- Lint: aprovado.
- Typecheck: aprovado.
- Testes: 3/3 aprovados.
- Build: aprovado.
- Navegador mobile 390x844: menu abre, chips presentes, sem conteúdo cortado.
- Navegador desktop 1280px: logo visível, navegação flexível e motion bundle presente.

## Lighthouse antes
Performance mobile: 100; Acessibilidade: 96; Best Practices: 96; SEO: 100.

## Lighthouse depois
Performance: 100; Acessibilidade: 96; Best Practices: 96; SEO: 100.
LCP: 1.4 s; CLS: 0; TBT: 0 ms.

## Comparação de métricas
A camada visual foi adicionada sem queda na meta obrigatória de Performance mobile (≥95), sem CLS e sem TBT mensurável.

## Evidências visuais
- [Hero mobile](../reports/mobile-hero-phase2.png)
- [Serviços mobile](../reports/mobile-services-phase2.png)
- Breakpoint validado: 390x844.

## Pendências
- Validar visualmente em dispositivos físicos 320x568, 360x800, 375x812, 412x915 e 430x932 após o deploy.
