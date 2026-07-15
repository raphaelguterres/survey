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
  assert.match(html, /class="scroll-cue"/);
  assert.match(app, /initializeScrollCue/);
  assert.match(css, /--motion-ease-out/);
});

test('cards de atividades mantêm visual clean sem ícones', () => {
  assert.match(css, /\.activities li::after \{\s*display: none;/);
  assert.match(css, /\.activities summary \{[\s\S]*padding-right: 0/);
});

test('fase 3 inclui CTAs compactos e galeria mobile nativa', () => {
  assert.match(html, /class="[^"]*mobile-field-gallery__track/);
  assert.match(html, /loading="lazy" decoding="async"/);
  assert.match(css, /\.hero-actions \.btn \{[\s\S]*min-height: 44px/);
  assert.match(css, /scroll-snap-type: x mandatory/);
  assert.match(css, /mobile-field-card|mobile-field-gallery/);
  assert.match(html, /matchMedia\('\(min-width: 768px\)'\)/);
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
});test('fase 5: CTAs compactos com secundario discreto e eixo global', () => {
  assert.match(css, /Auditoria sênior UI\/UX mobile/);
  assert.match(css, /--control-height: 44px/);
  assert.match(css, /\.hero-actions \.hero-action--primary \{[\s\S]*?max-width: 190px/);
  assert.match(css, /\.hero-actions \.btn\.ghost\.hero-action--secondary,[\s\S]*?border-bottom: 1px solid/);
  assert.match(css, /--mobile-content-max: 440px/);
  assert.doesNotMatch(html, /tech-chip/);
  assert.doesNotMatch(html, /Deslize para explorar/);
  assert.match(html, /01<\/span> &mdash; Atua&ccedil;&atilde;o em campo/);
});