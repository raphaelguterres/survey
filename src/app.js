function enviar(ev){ev.preventDefault();const form=ev.currentTarget;const btn=form.querySelector('button');const old=btn.textContent;btn.textContent='Solicitacao enviada';setTimeout(()=>{form.reset();btn.textContent=old},2200);return false}
(function(){
  const header=document.querySelector('header');
  const burger=document.querySelector('.burger');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const themeButtons=[...document.querySelectorAll('[data-theme-choice]')];
  function setTheme(theme){
    const selected=theme==='dark'?'dark':'light';
    document.documentElement.dataset.theme=selected;
    themeButtons.forEach(btn=>btn.classList.toggle('is-active',btn.dataset.themeChoice===selected));
  }
  themeButtons.forEach(btn=>btn.addEventListener('click',()=>{setTheme(btn.dataset.themeChoice);header?.classList.remove('menu-open');burger?.setAttribute('aria-expanded','false')}));
  setTheme('dark');
  if(burger&&header){
    burger.addEventListener('click',()=>{const open=!header.classList.contains('menu-open');header.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',open?'true':'false')});
    document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('menu-open');burger.setAttribute('aria-expanded','false')}));
  }

  const pop=document.createElement('div');
  pop.className='info-popover';
  pop.setAttribute('role','tooltip');
  document.body.appendChild(pop);
  let activeTip=null;
  function tipText(el){return el.dataset.tip||el.querySelector('.activity-info')?.textContent?.trim()||''}
  function placeTip(el){const text=tipText(el);if(!text)return;activeTip=el;pop.textContent=text;pop.classList.add('show');const r=el.getBoundingClientRect();const gap=12;const maxW=Math.min(320,window.innerWidth-28);pop.style.maxWidth=maxW+'px';let left=Math.min(Math.max(14,r.left+18),window.innerWidth-maxW-14);pop.style.left=left+'px';pop.style.top='0px';const h=pop.offsetHeight;let top=r.top-h-gap;if(top<12)top=r.bottom+gap;pop.style.top=top+'px'}
  function hideTip(){activeTip=null;pop.classList.remove('show')}
  document.querySelectorAll('.activities li,.service-list a[data-tip]').forEach(el=>{el.addEventListener('mouseenter',()=>placeTip(el));el.addEventListener('focus',()=>placeTip(el));el.addEventListener('pointerdown',ev=>{if(el.matches('.service-list a[data-tip]'))ev.preventDefault();placeTip(el)});el.addEventListener('mouseleave',hideTip);el.addEventListener('blur',hideTip);el.addEventListener('click',ev=>{if(el.matches('.service-list a[data-tip]'))ev.preventDefault();placeTip(el)})});
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape')hideTip()});
  document.addEventListener('click',ev=>{if(!ev.target.closest('.activities li,.service-list a[data-tip]'))hideTip()});
  window.addEventListener('scroll',()=>{if(activeTip)placeTip(activeTip)},{passive:true});
  window.addEventListener('resize',hideTip);

  function markHeader(){header?.classList.toggle('is-scrolled',window.scrollY>24)}
  markHeader();
  window.addEventListener('scroll',markHeader,{passive:true});

  function fallbackReveal(){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}})},{threshold:.06,rootMargin:'0px 0px -4% 0px'});document.querySelectorAll('.rv').forEach(el=>observer.observe(el))}

  const gsapReady=window.gsap&&window.ScrollTrigger;
  if(gsapReady&&!reduce){
    document.documentElement.classList.add('gsap-ready');
    gsap.registerPlugin(ScrollTrigger);
    gsap.set('.brand-logo',{autoAlpha:1,y:0,scale:1});
    gsap.utils.toArray('.rv').filter(el=>!el.closest('.hero')).forEach((el,i)=>{gsap.fromTo(el,{autoAlpha:0,y:26},{autoAlpha:1,y:0,duration:.34,ease:'power2.out',delay:(i%3)*.04,scrollTrigger:{trigger:el,start:'top 92%',once:true}})});
    gsap.set('.photo-card',{autoAlpha:1,y:0,scale:1});
    gsap.to('.hero',{ '--hero-parallax':'42px', ease:'none', scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    const waterHero=document.querySelector('.hero');
    if(waterHero){
      gsap.timeline({repeat:-1,yoyo:true,defaults:{duration:5.2,ease:'sine.inOut'}})
        .to(waterHero,{'--fluid-x':'12px','--fluid-y':'-5px','--fluid-scale':1.006})
        .to(waterHero,{'--fluid-x':'-10px','--fluid-y':'4px','--fluid-scale':1.002});
      waterHero.addEventListener('pointermove',ev=>{
        const r=waterHero.getBoundingClientRect();
        const mx=((ev.clientX-r.left)/r.width-.5)*18;
        const my=((ev.clientY-r.top)/r.height-.5)*12;
        gsap.to(waterHero,{'--mouse-x':mx+'px','--mouse-y':my+'px',duration:.55,ease:'power3.out',overwrite:'auto'});
      });
      waterHero.addEventListener('pointerleave',()=>{
        gsap.to(waterHero,{'--mouse-x':'0px','--mouse-y':'0px',duration:.9,ease:'power2.out',overwrite:'auto'});
      });
    }
    gsap.utils.toArray('.card').forEach(card=>{gsap.from(card,{autoAlpha:0,y:24,duration:.32,ease:'power2.out',scrollTrigger:{trigger:card,start:'top 92%',once:true}})});
    const navLinks=gsap.utils.toArray('.links a[href^="#"]').filter(a=>document.querySelector(a.getAttribute('href')));
    navLinks.forEach(link=>{const target=document.querySelector(link.getAttribute('href'));ScrollTrigger.create({trigger:target,start:'top center',end:'bottom center',onToggle:self=>{if(self.isActive){navLinks.forEach(a=>a.classList.remove('is-active'));link.classList.add('is-active')}}})});
    ScrollTrigger.create({start:24,end:999999,onUpdate:self=>header?.classList.toggle('is-scrolled',self.scroll()>24)});
  }else{
    document.querySelectorAll('.rv').forEach(el=>el.classList.remove('in'));
    fallbackReveal();
  }
})();
