import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { animated, useSpring } from '@react-spring/web';
import { animate as animeAnimate, stagger } from 'animejs';
import { animate as motionAnimate, inView, scroll } from 'motion';

function SignalPanel() {
  const springs = useSpring({ from: { y: 8, scale: 0.98, opacity: 0, width: 34 }, to: { y: 0, scale: 1, opacity: 1, width: 78 }, config: { mass: 1.2, tension: 170, friction: 18 } });
  useEffect(() => {
    const pulse = window.setInterval(() => {
      springs.width.start({ width: 68, config: { tension: 220, friction: 14 } }).then(() => springs.width.start({ width: 78, config: { tension: 150, friction: 18 } }));
    }, 2600);
    return () => window.clearInterval(pulse);
  }, [springs.width]);
  return <animated.aside className="spring-signal-card" style={{ opacity: springs.opacity, transform: springs.y.to((y) => `translate3d(0, ${y}px, 0) scale(${springs.scale.get()})`) }}>
    <div className="spring-signal-head"><span className="signal-dot" /><span>Leitura ao vivo</span></div>
    <strong>Dados em movimento</strong><p>Uma camada visual para acompanhar o comportamento do territorio.</p>
    <div className="signal-bars" aria-hidden="true"><span style={{ height: '42%' }} /><span style={{ height: '68%' }} /><animated.span style={{ height: springs.width.to((width) => `${width}%`) }} /><span style={{ height: '54%' }} /><span style={{ height: '82%' }} /></div>
    <small>REACT SPRING / SURVEY HYDRO</small>
  </animated.aside>;
}

function startAnime() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  animeAnimate('.hero .eyebrow', { opacity: [0, 1], translateY: [-10, 0], duration: 650, ease: 'out(3)' });
  animeAnimate('.hero-actions .btn', { opacity: [0, 1], translateY: [12, 0], delay: stagger(90, { start: 280 }), duration: 700, ease: 'out(4)' });
  animeAnimate('.river-line, .river-sheen', { strokeDashoffset: [0, -1100], duration: 9000, delay: stagger(220), loop: true, ease: 'linear' });
  document.querySelectorAll('.btn, .photo-card, .activities li').forEach((element) => {
    element.addEventListener('mouseenter', () => animeAnimate(element, { scale: 1.018, duration: 260, ease: 'out(3)' }));
    element.addEventListener('mouseleave', () => animeAnimate(element, { scale: 1, duration: 360, ease: 'out(3)' }));
  });
}

function startMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.section-title, .activity-layout, .cards, .clients, .contact-grid').forEach((element) => {
    element.style.opacity = '0'; element.style.transform = 'translateY(24px)';
    inView(element, () => motionAnimate(element, { opacity: 1, y: 0 }, { duration: 0.34, ease: [0.22, 1, 0.36, 1] }), { amount: 0.1 });
  });
  const header = document.querySelector('header');
  if (header) scroll((progress) => header.style.setProperty('--scroll-progress', `${progress * 100}%`));

  const hero = document.querySelector('.hero');
  if (hero) scroll((progress) => { hero.style.setProperty('--motion-progress', progress); hero.style.setProperty('--motion-shift', `${progress * 26}px`); }, { target: hero });
}

function boot() {
  const host = document.querySelector('#spring-signal');
  if (host) createRoot(host).render(<SignalPanel />);
  startAnime(); startMotion(); document.documentElement.dataset.motionReady = 'true';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
