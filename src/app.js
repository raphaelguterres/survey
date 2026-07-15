const SELECTORS = { header: 'header', burger: '.burger', nav: '.links', themeButtons: '[data-theme-choice]', navLinks: '.links a', serviceToggle: '.service-toggle', serviceMenu: '.service-menu', revealElements: '.rv', contactForm: '#contact-form' };
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionDisabled = () => motionQuery.matches;

function setMenuState(header, burger, open) {
  header?.classList.toggle('menu-open', open);
  burger?.setAttribute('aria-expanded', String(open));
  burger?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-lock', open && window.innerWidth <= 980);
}

function initializeThemeControls(header, burger) {
  const buttons = [...document.querySelectorAll(SELECTORS.themeButtons)];
  const saved = localStorage.getItem('survey-theme');
  const initial = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const apply = (theme) => {
    const selected = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = selected;
    localStorage.setItem('survey-theme', selected);
    buttons.forEach((button) => {
      const active = button.dataset.themeChoice === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  buttons.forEach((button) => button.addEventListener('click', () => { apply(button.dataset.themeChoice); setMenuState(header, burger, false); }));
  apply(initial);
}

function initializeNavigation(header, burger) {
  if (!header) return;
  const toggle = document.querySelector(SELECTORS.serviceToggle);
  const serviceMenu = document.querySelector(SELECTORS.serviceMenu);
  const navService = document.querySelector('.nav-service');
  burger?.addEventListener('click', () => setMenuState(header, burger, !header.classList.contains('menu-open')));
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    serviceMenu?.classList.toggle('is-open', !expanded);
  });
  if (navService && toggle) {
    navService.addEventListener('focusin', () => {
      toggle.setAttribute('aria-expanded', 'true');
    });
    navService.addEventListener('focusout', (event) => {
      if (!navService.contains(event.relatedTarget)) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  document.querySelectorAll(SELECTORS.navLinks).forEach((link) => link.addEventListener('click', () => setMenuState(header, burger, false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenuState(header, burger, false); });
  document.addEventListener('pointerdown', (event) => {
    if (header?.classList.contains('menu-open') && !header.contains(event.target)) setMenuState(header, burger, false);
  });
}

function initializeHeaderState(header) {
  if (!header) return;
  let ticking = false;
  const update = () => { header.classList.toggle('is-scrolled', window.scrollY > 24); ticking = false; };
  const onScroll = () => { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
}


function initializeScrollCue() {
  const cue = document.querySelector('.scroll-cue');
  if (!cue) return;
  const hide = () => cue.classList.add('is-hidden');
  window.addEventListener('scroll', hide, { passive: true, once: true });
}

function initializeReveal() {
  const elements = document.querySelectorAll(SELECTORS.revealElements);
  if (!('IntersectionObserver' in window) || motionDisabled()) { elements.forEach((element) => element.classList.add('in')); return; }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  elements.forEach((element) => observer.observe(element));
}

let accordionBusy = false;

function initializeAccordions() {
  const items = [...document.querySelectorAll('.activities details')];
  items.forEach((item) => item.addEventListener('toggle', () => {
    if (accordionBusy) return;
    if (!item.open) return;
    accordionBusy = true;
    items.filter((other) => other !== item).forEach((other) => { other.open = false; });
    accordionBusy = false;
  }));
}

function initializeContactForm() {
  const form = document.querySelector(SELECTORS.contactForm);
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!status) return;
    button.disabled = true;
    button.textContent = 'Enviando...';
    status.textContent = 'Recebemos seus dados. Retornaremos em breve.';
    window.setTimeout(() => { form.reset(); button.disabled = false; button.textContent = 'Enviar solicita\u00e7\u00e3o'; }, 1800);
  });
}

function initializeApp() {
  const header = document.querySelector(SELECTORS.header);
  const burger = document.querySelector(SELECTORS.burger);
  initializeThemeControls(header, burger);
  initializeNavigation(header, burger);
  initializeHeaderState(header);
  initializeScrollCue();
  initializeReveal();
  initializeAccordions();
  initializeContactForm();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeApp, { once: true }); else initializeApp();