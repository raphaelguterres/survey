const SELECTORS = {
  header: 'header',
  burger: '.burger',
  themeButtons: '[data-theme-choice]',
  navLinks: '.links a',
  tooltipTargets: '.activities li, .service-list a[data-tip]',
  revealElements: '.rv',
  contactForm: '#contact-form'
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMobileMenu(header, burger) {
  header?.classList.remove('menu-open');
  burger?.setAttribute('aria-expanded', 'false');
}

function applyTheme(theme, themeButtons) {
  const selectedTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = selectedTheme;

  themeButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.themeChoice === selectedTheme);
  });
}

function initializeThemeControls(header, burger) {
  const themeButtons = [...document.querySelectorAll(SELECTORS.themeButtons)];

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.themeChoice, themeButtons);
      closeMobileMenu(header, burger);
    });
  });

  applyTheme('dark', themeButtons);
}

function readTooltipText(element) {
  return element.dataset.tip || element.querySelector('.activity-info')?.textContent?.trim() || '';
}

function initializeTooltips() {
  const tooltip = document.createElement('div');
  tooltip.className = 'info-popover';
  tooltip.setAttribute('role', 'tooltip');
  document.body.appendChild(tooltip);

  let activeElement = null;

  function hideTooltip() {
    activeElement = null;
    tooltip.classList.remove('show');
  }

  function positionTooltip(element) {
    const text = readTooltipText(element);
    if (!text) return;

    activeElement = element;
    tooltip.textContent = text;
    tooltip.classList.add('show');

    const bounds = element.getBoundingClientRect();
    const gap = 12;
    const maxWidth = Math.min(320, window.innerWidth - 28);
    const left = Math.min(Math.max(14, bounds.left + 18), window.innerWidth - maxWidth - 14);

    tooltip.style.maxWidth = `${maxWidth}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = '0px';

    const tooltipHeight = tooltip.offsetHeight;
    const top = bounds.top - tooltipHeight - gap;
    tooltip.style.top = `${top < 12 ? bounds.bottom + gap : top}px`;
  }

  document.querySelectorAll(SELECTORS.tooltipTargets).forEach((element) => {
    const isServiceLink = element.matches('.service-list a[data-tip]');

    element.addEventListener('mouseenter', () => positionTooltip(element));
    element.addEventListener('focus', () => positionTooltip(element));
    element.addEventListener('mouseleave', hideTooltip);
    element.addEventListener('blur', hideTooltip);
    element.addEventListener('pointerdown', (event) => {
      if (isServiceLink) event.preventDefault();
      positionTooltip(element);
    });
    element.addEventListener('click', (event) => {
      if (isServiceLink) event.preventDefault();
      positionTooltip(element);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideTooltip();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest(SELECTORS.tooltipTargets)) hideTooltip();
  });

  window.addEventListener('scroll', () => {
    if (activeElement) positionTooltip(activeElement);
  }, { passive: true });
  window.addEventListener('resize', hideTooltip);
}

function initializeNavigation(header, burger) {
  if (!header || !burger) return;

  burger.addEventListener('click', () => {
    const isOpen = !header.classList.contains('menu-open');
    header.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll(SELECTORS.navLinks).forEach((link) => {
    link.addEventListener('click', () => closeMobileMenu(header, burger));
  });
}

function initializeHeaderState(header) {
  const updateHeaderState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

function initializeFallbackReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(SELECTORS.revealElements).forEach((element) => element.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });

  document.querySelectorAll(SELECTORS.revealElements).forEach((element) => observer.observe(element));
}

function initializeGsapAnimations(header) {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger || prefersReducedMotion) {
    initializeFallbackReveal();
    return;
  }

  document.documentElement.classList.add('gsap-ready');
  gsap.registerPlugin(ScrollTrigger);
  gsap.set('.brand-logo', { autoAlpha: 1, y: 0, scale: 1 });
  gsap.set('.photo-card', { autoAlpha: 1, y: 0, scale: 1 });

  gsap.utils.toArray(SELECTORS.revealElements)
    .filter((element) => !element.closest('.hero'))
    .forEach((element, index) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power2.out', delay: (index % 3) * 0.04,
          scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
    });

  gsap.to('.hero', {
    '--hero-parallax': '42px',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  initializeHeroMotion(gsap);

  gsap.utils.toArray('.card').forEach((card) => {
    gsap.from(card, { autoAlpha: 0, y: 24, duration: 0.32, ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 92%', once: true } });
  });

  initializeActiveNavigation(gsap, ScrollTrigger);
  ScrollTrigger.create({ start: 24, end: 999999,
    onUpdate: (self) => header?.classList.toggle('is-scrolled', self.scroll() > 24) });
}

function initializeHeroMotion(gsap) {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 5.2, ease: 'sine.inOut' } })
    .to(hero, { '--fluid-x': '12px', '--fluid-y': '-5px', '--fluid-scale': 1.006 })
    .to(hero, { '--fluid-x': '-10px', '--fluid-y': '4px', '--fluid-scale': 1.002 });

  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const mouseX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const mouseY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
    gsap.to(hero, { '--mouse-x': `${mouseX}px`, '--mouse-y': `${mouseY}px`, duration: 0.55,
      ease: 'power3.out', overwrite: 'auto' });
  });

  hero.addEventListener('pointerleave', () => {
    gsap.to(hero, { '--mouse-x': '0px', '--mouse-y': '0px', duration: 0.9,
      ease: 'power2.out', overwrite: 'auto' });
  });
}

function initializeActiveNavigation(gsap, ScrollTrigger) {
  const navLinks = gsap.utils.toArray('.links a[href^="#"]')
    .filter((link) => document.querySelector(link.getAttribute('href')));

  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    ScrollTrigger.create({
      trigger: target,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (!self.isActive) return;
        navLinks.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  });
}

function initializeContactForm() {
  const form = document.querySelector(SELECTORS.contactForm);
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalLabel = submitButton.textContent;
    submitButton.textContent = 'Solicitação enviada';

    window.setTimeout(() => {
      form.reset();
      submitButton.textContent = originalLabel;
    }, 2200);
  });
}

function initializeApp() {
  const header = document.querySelector(SELECTORS.header);
  const burger = document.querySelector(SELECTORS.burger);

  initializeThemeControls(header, burger);
  initializeNavigation(header, burger);
  initializeHeaderState(header);
  initializeTooltips();
  initializeContactForm();
  initializeGsapAnimations(header);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp, { once: true });
} else {
  initializeApp();
}
