/* ═══════════════════════════════════════════════════════════
   AsaaDev Portfolio — script.js
   • Navbar scroll effect
   • Mobile menu toggle
   • Scroll-reveal animation (IntersectionObserver)
   • Active nav link highlight
═══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── DOM References ─────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = document.querySelectorAll('.nav-link');
  const revealEls = document.querySelectorAll('.reveal');
  const sections  = document.querySelectorAll('section[id]');

  /* ─── 1. Navbar: Add "scrolled" class after 40 px ── */
  function handleNavScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* ─── 2. Mobile menu toggle ──────────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });


  /* ─── 3. Scroll-reveal with IntersectionObserver ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop watching
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─── 4. Active nav link on scroll ──────────────── */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          allLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    {
      root: null,
      threshold: 0.45
    }
  );

  sections.forEach(sec => sectionObserver.observe(sec));


  /* ─── 5. Smooth scroll polyfill for older Safari ─── */
  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });


  /* ─── 6. Hero wave animation (subtle parallax) ─── */
  const waves = document.querySelector('.hero-waves');
  if (waves) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroH    = document.getElementById('hero')?.offsetHeight || 600;
      if (scrolled < heroH) {
        const pct = scrolled / heroH;
        waves.style.transform = `translateY(${pct * 40}px)`;
      }
    }, { passive: true });
  }


  /* ─── 7. Card tilt micro-interaction ────────────── */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 6;   // tilt degrees
      const rotY   =  dx * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ─── 8. Active nav link style (CSS hook) ────────── */
  // Add CSS for .nav-link.active via JS to keep CSS file clean
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--white) !important;
    }
    .nav-link.active::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);

})();
