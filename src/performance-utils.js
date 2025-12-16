/* =========================
Critical Resource Hints and Performance Optimizations
Add this to your HTML head section for better loading performance
=========================== */

// Resource hints to add to HTML head
const resourceHints = `
  <!-- DNS prefetch for external domains -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
  
  <!-- Preload critical assets -->
  <link rel="preload" href="/src/main-optimized.js" as="script">
  <link rel="preload" href="/src/css/main.css" as="style">
  <link rel="preload" href="/images/shared/Web Desktop Light Theme.svg" as="image">
  
  <!-- Preconnect to important origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Critical CSS inline (first 14KB) -->
  <style>
    /* Critical above-the-fold styles */
    .main-container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .footer { background: white; }
    .dark .footer { background: #1a1a1a; }
    .grid { display: grid; }
    .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
    .col-span-12 { grid-column: span 12 / span 12; }
    .hidden { display: none; }
    .sr-only { 
      position: absolute; 
      width: 1px; 
      height: 1px; 
      padding: 0; 
      margin: -1px; 
      overflow: hidden; 
      clip: rect(0, 0, 0, 0); 
      white-space: nowrap; 
      border: 0; 
    }
  </style>
`;

// Function to add resource hints to document head
export const addResourceHints = () => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = resourceHints;

  Array.from(tempDiv.children).forEach(element => {
    document.head.appendChild(element);
  });
};

// Service Worker registration for caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Image lazy loading optimization
export const optimizeImages = () => {
  // Add intersection observer for images without native lazy loading support
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Performance monitoring
export const monitorPerformance = () => {
  // Web Vitals monitoring
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }
};

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
  addResourceHints();
  optimizeImages();
  monitorPerformance();
  registerServiceWorker();
});
