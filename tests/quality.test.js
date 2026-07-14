import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('pagina usa navegacao e accordion acessiveis', () => {
  assert.match(html, /aria-controls="main-navigation"/);
  assert.match(html, /<details>/);
  assert.match(html, /aria-live="polite"/);
});

test('animacao pesada fica restrita ao desktop', () => {
  assert.doesNotMatch(html, /gsap|ScrollTrigger/);
  assert.match(html, /pointer: fine/);
  assert.match(html, /motion-enhancements\.js/);
  assert.match(app, /IntersectionObserver/);
});

test('CSS contempla movimento reduzido e safe area', () => {
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.doesNotMatch(css, /transition:\s*all/);
});

test('fase 2 adiciona vida visual sem scroll continuo', () => {
  assert.match(html, /class="tech-chips"/);
  assert.match(html, /class="scroll-cue"/);
  assert.match(app, /initializeScrollCue/);
  assert.match(css, /--motion-ease-out/);
  assert.match(css, /tech-chip:active/);
});

test('cards de atividades mantêm visual clean sem ícones', () => {
  assert.match(css, /\.activities li::after,\s*\.activities summary::after/);
  assert.match(css, /\.activities summary \{[\s\S]*padding-right: 0/);
});

test('fase 3 inclui CTAs compactos e galeria mobile nativa', () => {
  assert.match(html, /class="[^"]*mobile-field-gallery__track/);
  assert.match(html, /loading="lazy" decoding="async"/);
  assert.match(css, /\.hero-actions \.btn \{[\s\S]*min-height: 44px/);
  assert.match(css, /scroll-snap-type: x mandatory/);
  assert.match(css, /mobile-field-card|mobile-field-gallery/);
  assert.match(html, /window\.innerWidth > 767/);
});
test('fase 4 usa grids editoriais mobile e CTAs com toque acessivel', () => {
  assert.match(html, /hero-mobile-grid/);
  assert.match(html, /mobile-field-grid/);
  assert.match(html, /mobile-field-card--topografia/);
  assert.match(html, /clients-grid/);
  assert.match(html, /process-grid/);
  assert.match(html, /form-field--full/);
  assert.match(css, /grid-template-columns: 1.15fr .85fr/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /@media \(max-width: 359px\)/);
});test('mobile hero nao deve criar vazio vertical no primeiro fold', () => {
  assert.match(css, /Hotfix visual: mobile hero/);
  assert.match(css, /\.hero,\s*\.hero-grid,\s*\.hero-mobile-grid \{[\s\S]*min-height: auto !important/);
  assert.match(css, /align-content: start/);
});test('CTAs mobile respeitam colunas iguais do grid', () => {
  assert.match(css, /Hotfix visual 2: hero actions aligned/);
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.hero-actions \.btn\.primary,[\s\S]*width: 100% !important/);
  assert.match(css, /min-width: 0 !important/);
});