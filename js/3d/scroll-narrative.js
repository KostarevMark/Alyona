// Ties page scroll and the active wagon (detected by main.js via
// IntersectionObserver on each .wagon-chapter, dispatched as a
// `wagon-change` CustomEvent) to the 3D train scene.

export function initScrollNarrative(scene) {
  scene.setActiveWagon(window.__activeWagon || 0);
  window.addEventListener('wagon-change', (e) => scene.setActiveWagon(e.detail));

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      scene.setJourneyProgress(progress);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
