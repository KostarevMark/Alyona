// Ночной экспресс — interaction layer for the redesigned site.
// Handles: scroll reveals, active-wagon detection, per-wagon photo
// galleries, and exposes the active wagon index on `window.__activeWagon`
// for the 3D scroll-narrative module to read.

(() => {
  /* ---------- scroll reveals ---------- */
  const revealTargets = document.querySelectorAll('.reveal-word, .reveal-rise, .reveal-lines');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    revealObserver.observe(el);
  });

  /* ---------- "universe" galaxy video: lazy-loaded, skipped for reduced motion ---------- */
  const universeVideo = document.querySelector('.universe-video');
  if (universeVideo && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        videoObserver.disconnect();
        universeVideo.muted = true; // belt-and-suspenders: autoplay policies key off the property, not just the attribute
        universeVideo.src = universeVideo.dataset.src;
        universeVideo.addEventListener('loadeddata', () => universeVideo.classList.add('is-active'), { once: true });
        universeVideo.play().catch(() => {}); // autoplay can be refused by some browsers; the video just stays paused
      });
    }, { rootMargin: '300px' });
    videoObserver.observe(universeVideo);
  }

  /* ---------- active-wagon detection (drives the 3D camera) ---------- */
  const sections = ['hero', 'wagon-0', 'wagon-1', 'wagon-2', 'wagon-3', 'wagon-4', 'wagon-5', 'wagon-6', 'wagon-7', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (id.startsWith('wagon-')) {
        window.__activeWagon = Number(id.split('-')[1]);
        window.dispatchEvent(new CustomEvent('wagon-change', { detail: window.__activeWagon }));
      }
    });
  }, { threshold: 0.5 });
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- lightbox: shared fullscreen viewer for every gallery ---------- */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Закрыть" data-i18n-aria="aria-lightbox-close">×</button>
    <button class="lightbox-nav lightbox-nav--prev" type="button" aria-label="Предыдущее фото" data-i18n-aria="aria-lightbox-prev">‹</button>
    <button class="lightbox-nav lightbox-nav--next" type="button" aria-label="Следующее фото" data-i18n-aria="aria-lightbox-next">›</button>
    <div class="lightbox-stage"></div>
    <div class="lightbox-dots"></div>
  `;
  document.body.appendChild(lightbox);
  const stage = lightbox.querySelector('.lightbox-stage');
  const dotsHost = lightbox.querySelector('.lightbox-dots');
  const prevBtn = lightbox.querySelector('.lightbox-nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav--next');

  let current = null; // the gallery controller currently shown in the lightbox
  let lightboxImgs = [];
  let lightboxDots = [];

  function openLightbox(controller) {
    current = controller;
    stage.innerHTML = '';
    dotsHost.innerHTML = '';
    lightboxImgs = controller.images.map((img, i) => {
      const clone = document.createElement('img');
      clone.className = 'lightbox-img';
      clone.src = img.src;
      clone.alt = img.alt;
      if (i === controller.index) clone.classList.add('active');
      stage.appendChild(clone);
      return clone;
    });
    const multi = controller.images.length > 1;
    prevBtn.hidden = nextBtn.hidden = !multi;
    lightboxDots = multi ? controller.images.map((_, i) => {
      const d = document.createElement('span');
      if (i === controller.index) d.classList.add('active');
      d.addEventListener('click', () => current.show(i));
      dotsHost.appendChild(d);
      return d;
    }) : [];

    const thumb = controller.gallery.querySelector('img.active');
    const firstRect = thumb.getBoundingClientRect();

    document.body.classList.add('lightbox-open');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.__lastTrigger = document.activeElement;
    lightbox.querySelector('.lightbox-close').focus({ preventScroll: true });

    // FLIP: the active image starts pinned exactly over the clicked thumbnail,
    // then animates to its natural centred layout — reads as the photo
    // physically expanding from where the user clicked, not just fading in.
    requestAnimationFrame(() => {
      const target = lightboxImgs[controller.index];
      const finalRect = target.getBoundingClientRect();
      const dx = (firstRect.left + firstRect.width / 2) - (finalRect.left + finalRect.width / 2);
      const dy = (firstRect.top + firstRect.height / 2) - (finalRect.top + finalRect.height / 2);
      const sx = firstRect.width / finalRect.width;
      const sy = firstRect.height / finalRect.height;
      target.style.transition = 'none';
      target.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      target.getBoundingClientRect(); // force reflow so the transition below picks up cleanly
      requestAnimationFrame(() => {
        target.style.transition = '';
        target.style.transform = '';
      });
    });
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    const target = lightboxImgs[current.index];
    const thumb = current.gallery.querySelector('img.active');
    if (target && thumb) {
      const finalRect = target.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      const dx = (thumbRect.left + thumbRect.width / 2) - (finalRect.left + finalRect.width / 2);
      const dy = (thumbRect.top + thumbRect.height / 2) - (finalRect.top + finalRect.height / 2);
      const sx = thumbRect.width / finalRect.width;
      const sy = thumbRect.height / finalRect.height;
      target.style.transition = 'transform .45s var(--ease-soft)';
      target.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    }
    lightbox.classList.add('is-closing');
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightbox.__lastTrigger?.focus?.({ preventScroll: true });
    setTimeout(() => {
      lightbox.classList.remove('is-closing');
      stage.innerHTML = '';
      dotsHost.innerHTML = '';
      current = null;
    }, 480);
  }

  prevBtn.addEventListener('click', () => current?.show(current.index - 1));
  nextBtn.addEventListener('click', () => current?.show(current.index + 1));
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') current?.show(current.index - 1);
    else if (e.key === 'ArrowRight') current?.show(current.index + 1);
  });
  let lbStartX = 0;
  stage.addEventListener('touchstart', (e) => { lbStartX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - lbStartX;
    if (Math.abs(dx) > 50) current?.show(current.index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- per-wagon photo galleries ---------- */
  document.querySelectorAll('.wagon-photos').forEach((gallery) => {
    const images = [...gallery.querySelectorAll('img')];
    if (images.length === 0) return;
    let index = Math.max(0, images.findIndex((img) => img.classList.contains('active')));
    const multi = images.length > 1;

    let dots = [];
    if (multi) {
      const dotsHostSmall = gallery.querySelector('.photo-dots');
      dots = images.map((_, i) => {
        const d = document.createElement('span');
        if (i === index) d.classList.add('active');
        d.addEventListener('click', (e) => { e.stopPropagation(); show(i); });
        dotsHostSmall.appendChild(d);
        return d;
      });
    } else {
      gallery.querySelectorAll('.photo-nav, .photo-dots').forEach((el) => el.remove());
    }

    function show(i) {
      index = (i + images.length) % images.length;
      images.forEach((img, n) => img.classList.toggle('active', n === index));
      dots.forEach((d, n) => d.classList.toggle('active', n === index));
      if (current === controller) {
        lightboxImgs.forEach((img, n) => img.classList.toggle('active', n === index));
        lightboxDots.forEach((d, n) => d.classList.toggle('active', n === index));
      }
    }

    if (multi) {
      gallery.querySelector('.photo-nav--prev')?.addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
      gallery.querySelector('.photo-nav--next')?.addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });
    }

    const expandBtn = document.createElement('button');
    expandBtn.type = 'button';
    expandBtn.className = 'photo-expand';
    expandBtn.setAttribute('aria-label', 'Развернуть фото');
    expandBtn.setAttribute('data-i18n-aria', 'aria-photo-expand');
    expandBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    gallery.appendChild(expandBtn);

    const controller = { gallery, images, get index() { return index; }, show };

    let dragged = false, startX = 0;
    if (multi) {
      gallery.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dragged = false; }, { passive: true });
      gallery.addEventListener('touchmove', (e) => { if (Math.abs(e.touches[0].clientX - startX) > 10) dragged = true; }, { passive: true });
      gallery.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) { show(index + (dx < 0 ? 1 : -1)); dragged = true; }
      }, { passive: true });
    }

    gallery.addEventListener('click', (e) => {
      if (dragged) { dragged = false; return; }
      if (e.target.closest('.photo-nav')) return;
      openLightbox(controller);
    });
    expandBtn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(controller); });
  });
})();
