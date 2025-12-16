/* =========================
Optimized main.js with lazy loading and conditional imports
=========================== */

// Core utilities that are needed immediately
import './js/common/common';
import './js/utils/theme-switcher';

// Lazy load heavy libraries only when needed
const lazyLoadModule = async (modulePath) => {
  try {
    await import(modulePath);
  } catch (error) {
    console.warn(`Failed to load module: ${modulePath}`, error);
  }
};

// Intersection Observer for lazy loading components
const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Load modules based on page content
document.addEventListener('DOMContentLoaded', () => {
  // Load navigation immediately for interactivity
  lazyLoadModule('./js/common/mobile-menu');
  lazyLoadModule('./js/common/navigation-menu');

  // Lazy load heavy animation modules when elements come into view
  const animationObserver = createIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;

        // Load specific modules based on element classes/attributes
        if (target.classList.contains('accordion') || target.querySelector('.accordion')) {
          lazyLoadModule('./js/animation/accordion');
        }

        if (target.classList.contains('swiper') || target.querySelector('.swiper')) {
          lazyLoadModule('./js/animation/swiper');
        }

        if (target.classList.contains('modal-trigger') || target.querySelector('.modal-trigger')) {
          lazyLoadModule('./js/animation/modal');
        }

        if (target.classList.contains('slider') || target.querySelector('.slider')) {
          lazyLoadModule('./js/animation/slider');
        }

        if (target.classList.contains('tab-container') || target.querySelector('.tab-container')) {
          lazyLoadModule('./js/animation/tab');
        }

        if (target.classList.contains('marquee') || target.querySelector('.marquee')) {
          lazyLoadModule('./js/animation/marquee');
        }

        animationObserver.unobserve(target);
      }
    });
  });

  // Observe elements that might need animations
  const animatedElements = document.querySelectorAll('[data-animation], .swiper, .accordion, .modal-trigger, .slider, .tab-container, .marquee');
  animatedElements.forEach(el => animationObserver.observe(el));

  // Load utility modules conditionally
  setTimeout(() => {
    // Load these after initial render
    if (document.querySelector('.counter')) {
      lazyLoadModule('./js/utils/counter');
    }

    if (document.querySelector('.price-switcher')) {
      lazyLoadModule('./js/common/price-switcher');
    }

    if (document.querySelector('.progress-bar')) {
      lazyLoadModule('./js/common/progress');
    }

    if (document.querySelector('.img-before-after')) {
      lazyLoadModule('./js/utils/img-before-after-slider');
    }
  }, 1000);

  // Load heavy modules only when needed
  setTimeout(() => {
    if (document.querySelector('#map')) {
      lazyLoadModule('./js/utils/leaflet');
    }

    if (document.querySelector('.parallax')) {
      lazyLoadModule('./js/common/parallax-effect');
    }

    if (document.querySelector('.smooth-scroll')) {
      lazyLoadModule('./js/common/smooth-scrolling');
    }
  }, 2000);

  // Load remaining modules after page is fully interactive
  requestIdleCallback(() => {
    lazyLoadModule('./js/animation/customer-success-stories');
    lazyLoadModule('./js/animation/glossary');
    lazyLoadModule('./js/animation/gradient-path');
    lazyLoadModule('./js/animation/header');
    lazyLoadModule('./js/animation/sidebar');
    lazyLoadModule('./js/animation/svg-draw');
    lazyLoadModule('./js/animation/tab-filter');
    lazyLoadModule('./js/common/reveal-elements');
    lazyLoadModule('./js/utils/cookie');
    lazyLoadModule('./js/utils/force-theme-switcher');
  }, { timeout: 3000 });
});

// Preload critical modules on user interaction
let interactionLoaded = false;
const loadOnInteraction = () => {
  if (!interactionLoaded) {
    interactionLoaded = true;
    lazyLoadModule('./js/animation/modal');
    lazyLoadModule('./js/common/mobile-menu');
  }
};

document.addEventListener('mouseenter', loadOnInteraction, { once: true });
document.addEventListener('touchstart', loadOnInteraction, { once: true });
document.addEventListener('scroll', loadOnInteraction, { once: true });
