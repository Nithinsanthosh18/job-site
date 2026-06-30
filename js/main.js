/**
 * ORBIS — Main JS
 * GSAP ScrollTrigger animations + UI interactions
 */

import { initScene } from './scene.js';

// ── Wait for DOM ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // ── WebGL Scene ──────────────────────────────────────────
  initScene();

  // ── GSAP + ScrollTrigger ─────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ── Hero entrance ────────────────────────────────────────
  const heroTl = gsap.timeline({ delay: 0.3 });
  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0)
    .to('.hero-headline', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.2)
    .to('.hero-sub',      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.45)
    .to('.hero-actions',  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.65);

  // Helper: batch reveal
  const batchReveal = (selector, stagger = 0.12) => {
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      });
    });
  };

  // About section
  batchReveal('#about .about-label');
  batchReveal('#about .about-heading');
  batchReveal('#about .about-body');
  batchReveal('#about .stat-item');
  batchReveal('#about .about-visual');

  // Service cards — staggered
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Section headers
  batchReveal('.section-label');
  batchReveal('.section-heading');

  // Process steps
  gsap.from('.process-step', {
    scrollTrigger: {
      trigger: '.process-steps',
      start: 'top 82%',
    },
    opacity: 0,
    y: 40,
    stagger: 0.14,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Contact
  batchReveal('#contact .contact-heading');
  batchReveal('#contact .contact-sub');
  batchReveal('#contact .contact-form');

  // ── Nav scroll state ─────────────────────────────────────
  const nav = document.querySelector('nav');
  const updateNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Custom cursor ────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (!matchMedia('(pointer: coarse)').matches) {
    let cx = 0, cy = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX; cy = e.clientY;
      gsap.to(cursor, { x: cx, y: cy, duration: 0.05 });
    });

    const animRing = () => {
      rx += (cx - rx) * 0.14;
      ry += (cy - ry) * 0.14;
      gsap.set(cursorRing, { x: rx, y: ry });
      requestAnimationFrame(animRing);
    };
    animRing();

    // Expand on interactive elements
    const hoverEls = document.querySelectorAll('a, button, input, textarea, .service-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursorRing, { width: 60, height: 60, borderColor: 'rgba(124,58,237,0.9)', duration: 0.3 });
        gsap.to(cursor, { scale: 0.5, duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorRing, { width: 40, height: 40, borderColor: 'rgba(124,58,237,0.5)', duration: 0.3 });
        gsap.to(cursor, { scale: 1, duration: 0.3 });
      });
    });
  } else {
    cursor.style.display = 'none';
    cursorRing.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  // ── Mobile nav toggle ────────────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);

      if (isOpen) {
        gsap.set([navLinks, navCta], { display: 'flex', opacity: 0, y: -10 });
        gsap.to([navLinks, navCta], { opacity: 1, y: 0, duration: 0.3 });
      } else {
        gsap.to([navLinks, navCta], {
          opacity: 0, y: -10, duration: 0.2,
          onComplete: () => gsap.set([navLinks, navCta], { display: 'none' })
        });
      }
    });
  }

  // ── Smooth anchor scroll ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 80 },
          duration: 1.2,
          ease: 'power3.inOut',
        });
        if (toggle?.classList.contains('open')) toggle.click();
      }
    });
  });

  // ── Counter animation ─────────────────────────────────────
  gsap.utils.toArray('.stat-number').forEach(el => {
    const end = parseInt(el.dataset.value, 10);
    const suffix = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from({ val: 0 }, {
          val: end,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          },
        });
      },
    });
  });

  // ── Contact form ──────────────────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      const orig = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#10b981';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }
});
