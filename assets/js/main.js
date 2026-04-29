/* ═══════════════════════════════════════════════════════════════
   FinnBIM — main.js
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Footer year ───────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ── 1. Mobile nav toggle ──────────────────────────────────── */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    /* Close on any menu link click */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    /* Close on Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    /* Close on outside click */
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMenu();
      }
    });
  }


  /* ── 2. Nav shrink on scroll ───────────────────────────────── */
  /* Large at top → compact after scrolling 80px */
  const nav = document.getElementById('nav');

  if (nav) {
    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); /* run once on load in case page is already scrolled */
  }


  /* ── 3. Scroll reveal ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); /* fire once */
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  }


  /* ── 4. Contact form — async Formspree submit ──────────────── */
  const form       = document.getElementById('contact-form');
  const formStatus = form && form.querySelector('.form-status');

  if (form && formStatus) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;

      /* Disable & show loading state */
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          formStatus.textContent = '✓ Message sent — we\'ll be in touch shortly.';
          formStatus.classList.add('success');
          form.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          const msg = data?.errors?.map(e => e.message).join(', ')
            || 'Something went wrong. Please try again.';
          formStatus.textContent = msg;
          formStatus.classList.add('error');
        }
      } catch {
        formStatus.textContent = 'Network error — please check your connection and try again.';
        formStatus.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }


  /* ── Smooth-scroll nav links (Safari fallback) ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 0;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

}());
