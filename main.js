// js/main.js
import { getDishStory, typewriterEffect } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- PAGE LOAD ---
  const overlay = document.querySelector('.page-load-overlay');
  
  // Wait for fonts to load using FontFace observer or just a timeout as fallback
  Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve()
  ]).then(() => {
    setTimeout(() => {
      if (overlay) overlay.classList.add('loaded');
      
      const heroSeq = document.querySelector('.hero-sequence');
      if (heroSeq) {
        requestAnimationFrame(() => {
          heroSeq.classList.add('ready');
        });
      }
    }, 500);
  });

  // --- NAVIGATION ---
  const nav = document.querySelector('.nav');
  const scrollHandler = debounce(() => {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, 10);
  
  window.addEventListener('scroll', scrollHandler, { passive: true });

  const hamburger = document.querySelector('.hamburger');
  const navLinksMobile = document.querySelector('.nav__links-mobile');
  
  if (hamburger && navLinksMobile) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinksMobile.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Smooth scroll anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetEl = document.querySelector(this.getAttribute('href'));
      if (targetEl) {
        if (hamburger && hamburger.classList.contains('open')) {
          hamburger.click();
        }
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetEl.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- SCROLL ANIMATIONS ---
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve to run animation only once
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  // --- MODAL & LIGHTBOX ---
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalBody = document.querySelector('.modal__body');
  const modalClose = document.querySelector('.modal__close');

  window.openModal = (content) => {
    if(modalBody) modalBody.innerHTML = '';
    if(typeof content === 'string') {
      modalBody.innerHTML = content;
    } else {
      modalBody.appendChild(content);
    }
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if(modalClose) modalClose.addEventListener('click', window.closeModal);
  if(modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) window.closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      window.closeModal();
    }
  });

  // --- CURSOR (Desktop only) ---
  if (matchMedia('(pointer:fine)').matches) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    });

    document.querySelectorAll('a, button, .interactive').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('custom-cursor--grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('custom-cursor--grow'));
    });
    
    // basic cursor styles via js since they are simple
    Object.assign(cursor.style, {
      position: 'fixed',
      top: 0, left: 0,
      width: '10px', height: '10px',
      backgroundColor: 'var(--color-gold)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.2s, height 0.2s',
      mixBlendMode: 'difference'
    });
  }
});

// Utility debounce mapping
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
