# Survey Hydro

Landing institucional da Survey Hydro, com foco em topografia, hidrometria, batimetria, hidrologia e meio ambiente.

## Organização do projeto

```text
.
├── index.html                 # Estrutura da página principal
├── src/
│   ├── app.js                 # Comportamentos da página e eventos
│   ├── styles.css             # Estilos, temas e responsividade
│   ├── motion-enhancements.jsx# Anime.js, React Spring e Motion.dev
│   └── hero3d.js              # Cena 3D opcional com React Three Fiber
├── assets/
│   ├── *.js                   # Bundles gerados para o navegador
│   ├── *.png                  # Imagens do hero e identidade visual
│   └── drive/                 # Imagens de campo e cards
├── docs/alternatives/         # Protótipos visuais não utilizados na página ativa
└── package.json               # Scripts e dependências
```

## Tecnologias

- HTML, CSS e JavaScript vanilla na página principal.
- GSAP e ScrollTrigger para transições e scroll storytelling.
- Anime.js, React Spring e Motion.dev em `src/motion-enhancements.jsx`.
- React Three Fiber e Three.js na cena 3D opcional.
- esbuild para gerar os arquivos de distribuição em `assets/`.

## Desenvolvimento local

Instale as dependências:

```bash
npm install
```

Gere os bundles:

```bash
npm run build
```

Inicie o servidor local:

```bash
npm run dev
```

Acesse <http://localhost:4174>.

## Convenções

- HTML representa apenas estrutura e conteúdo.
- CSS concentra layout, temas e estados visuais.
- JavaScript concentra eventos e comportamento da interface.
- Código-fonte fica em `src/`; arquivos gerados ficam em `assets/`.
- Protótipos antigos ficam em `docs/alternatives/` para não poluir a raiz do projeto.
- O formulário atual simula o envio localmente; a integração real de e-mail ainda precisa de um endpoint ou serviço transacional.
