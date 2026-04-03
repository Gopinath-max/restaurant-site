// js/animations.js
// Custom animations that are too complex for CSS or basic IntersectionObserver
// Most scroll animations are handled in main.js
export function initComplexAnimations() {
  // Example: Parallax effect for gallery images
  const galleryItems = document.querySelectorAll('.gallery-item img');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    galleryItems.forEach(item => {
      // Basic parallax calculation
      // item.style.transform = `translateY(${scrollY * 0.05}px)`;
    });
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    initComplexAnimations();
  }
});
