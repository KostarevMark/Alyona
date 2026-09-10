// Entry point for the 3D layer. Gates on prefers-reduced-motion and WebGL
// support (falls back to the plain 2D site — the fully-featured original —
// in either case, per the redesign plan), then lazy-mounts the scene once
// the hero section is close to view so it never blocks first paint.

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

async function boot() {
  if (prefersReducedMotion() || !supportsWebGL()) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  await new Promise((resolve) => {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        resolve();
      }
    }, { rootMargin: '200px' });
    io.observe(hero);
  });

  const canvas = document.createElement('canvas');
  canvas.id = 'train-canvas';
  document.body.prepend(canvas);
  document.body.classList.add('has-3d-train');

  const [{ initTrainScene }, { initScrollNarrative }] = await Promise.all([
    import('./train-scene.js'),
    import('./scroll-narrative.js'),
  ]);

  try {
    const scene = await initTrainScene(canvas);
    initScrollNarrative(scene);
  } catch (err) {
    // Loading/parsing the model failed for some reason — remove the empty
    // canvas and quietly keep the 2D site working.
    console.error('3D train scene failed to initialize, falling back to 2D.', err);
    canvas.remove();
    document.body.classList.remove('has-3d-train');
  }
}

boot();
