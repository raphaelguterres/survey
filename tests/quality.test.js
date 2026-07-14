import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('a página usa navegação e accordion acessíveis', () => {
  assert.match(html, /aria-controls="main-navigation"/);
  assert.match(html, /<details>/);
  assert.match(html, /aria-live="polite"/);
});

test('o caminho inicial não carrega bibliotecas de animação externas', () => {
  assert.doesNotMatch(html, /gsap|ScrollTrigger|motion-enhancements/);
  assert.match(app, /IntersectionObserver/);
});

test('o CSS contempla movimento reduzido e safe area', () => {
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.doesNotMatch(css, /transition:\s*all/);
});