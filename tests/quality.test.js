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
