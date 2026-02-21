/**
 * Simsiqueste — Smooth, dynamic interactions
 * Scroll reveals, magnetic hover (pointer devices), mobile menu, parallax
 * Cross-device: touch-friendly, no hover-only behavior on touch.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  // Scroll reveal and menu always run; magnetic and parallax only when appropriate

  // ----- Scroll reveal (works on all devices) -----
  const revealEls = document.querySelectorAll('.reveal');
  const revealOptions = { rootMargin: '0px 0px -4% 0px', threshold: 0.02 };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
    });
  }, revealOptions);

  revealEls.forEach((el) => revealObserver.observe(el));

  // ----- Snowfall (canvas): hero, about, contact — 60fps, soft edges, auto-resize -----
  (function initSnowfall() {
    if (prefersReducedMotion) return;

    function random(min, max) {
      return min + Math.random() * (max - min);
    }

    function initSectionSnow(section, canvas) {
      if (!section || !canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      let width = 0;
      let height = 0;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      const flakeCount = 110;
      let flakes = [];
      let rafId = 0;
      let lastTime = 0;

      function createFlakes() {
        flakes = [];
        for (let i = 0; i < flakeCount; i++) {
          flakes.push({
            x: random(0, width),
            y: random(-height * 0.2, height * 1.1),
            size: random(1.2, 4.2),
            speed: random(0.4, 1.4),
            phase: random(0, Math.PI * 2),
            swayAmplitude: random(8, 28),
            swayFreq: random(0.6, 1.8),
            windPhase: random(0, Math.PI * 2),
            opacity: random(0.35, 0.82),
          });
        }
      }

      function resize() {
        const rect = section.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width));
        const h = Math.max(1, Math.floor(rect.height));
        if (w === width && h === height) return;
        width = w;
        height = h;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        createFlakes();
      }

      function drawFlake(f) {
        const r = f.size;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        g.addColorStop(0, `rgba(255,255,255,${f.opacity})`);
        g.addColorStop(0.4, `rgba(255,255,255,${f.opacity * 0.5})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      function tick(now) {
        now = now || performance.now();
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        const dt = Math.min((now - lastTime) / 1000, 0.06) || 0.016;
        lastTime = now;
        const t = now / 1000;
        const wind = Math.sin(t * 0.3) * 6 + Math.sin(t * 0.7 + 1) * 3;

        ctx.clearRect(0, 0, width, height);

        flakes.forEach((f) => {
          f.y += f.speed * 85 * dt;
          f.x += Math.sin(t * f.swayFreq + f.phase) * f.swayAmplitude * dt * 0.8 + wind * dt;
          if (f.y > height + 10) {
            f.y = -10;
            f.x = random(0, width);
          }
          if (f.y < -10) f.y = height + 10;
          if (f.x > width + 15) f.x = -15;
          if (f.x < -15) f.x = width + 15;
          drawFlake(f);
        });

        rafId = requestAnimationFrame(tick);
      }

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(section);
      rafId = requestAnimationFrame((now) => {
        lastTime = now;
        tick(now);
      });
    }

    initSectionSnow(document.getElementById('hero'), document.getElementById('hero-snow-canvas'));
    initSectionSnow(document.getElementById('about'), document.getElementById('about-snow-canvas'));
    initSectionSnow(document.getElementById('contact'), document.getElementById('contact-snow-canvas'));
  })();

  // ----- Magnetic hover: only on devices with fine pointer (mouse/trackpad) -----
  if (hasHover && hasFinePointer) {
    const magneticEls = document.querySelectorAll('[data-magnetic]');
    const strength = 0.25;
    const radius = 80;

    magneticEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const distance = Math.sqrt(x * x + y * y);
        if (distance > radius) return;
        const force = (radius - distance) / radius;
        const tx = x * strength * force;
        const ty = y * strength * force;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ----- Mobile menu (touch and mouse) -----
  const menuBtn = document.querySelector('.menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuLinks = document.querySelectorAll('.menu-link');
  const body = document.body;

  function openMenu() {
    menuOverlay.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOverlay.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
    body.style.touchAction = '';
    document.documentElement.style.overflow = '';
  }

  menuBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (menuOverlay.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  menuOverlay?.addEventListener('click', (e) => {
    if (e.target === menuOverlay) closeMenu();
  });

  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay?.classList.contains('is-open')) closeMenu();
    if (e.key === 'Escape' && lightbox?.classList.contains('is-open')) closeBook();
  });

  // ----- Contact Instagram link: reliable redirect on all devices -----
  const instagramUrl = 'https://instagram.com/simsiqueste';
  const contactInstagram = document.getElementById('contact-instagram');
  if (contactInstagram) {
    contactInstagram.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        if (window.open(instagramUrl, '_blank', 'noopener,noreferrer')) {
          return;
        }
      } catch (err) {}
      window.location.href = instagramUrl;
    });
  }

  // ----- 3D Book lightbox for gallery artworks -----
  const lightbox = document.getElementById('lightbox');
  const book = document.getElementById('book');
  const bookPageArt = document.getElementById('book-page-art');
  const bookCrossfadeArt = document.getElementById('book-crossfade-art');
  const bookArtTitle = document.getElementById('book-art-title');
  const bookArtMedium = document.getElementById('book-art-medium');
  const waxSealClose = document.getElementById('wax-seal-close');
  const galleryLinks = document.querySelectorAll('.gallery-link');
  const soundOpen = document.getElementById('book-sound-open');
  const soundClose = document.getElementById('book-sound-close');

  const BOOK_OPEN_DURATION = 2000;
  const CROSSFADE_DURATION = 500;

  function playSound(el) {
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }

  function openBook(imgSrc, title, medium) {
    if (!lightbox || !bookPageArt) return;
    bookPageArt.style.backgroundImage = `url(${imgSrc})`;
    if (bookCrossfadeArt) {
      bookCrossfadeArt.style.backgroundImage = `url(${imgSrc})`;
    }
    if (bookArtTitle) bookArtTitle.textContent = title || 'Untitled';
    if (bookArtMedium) bookArtMedium.textContent = medium || '';
    lightbox.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    lightbox.classList.add('is-open');
    // Cross-fade: art fades out as closed book scales in; then book opens (2s)
    setTimeout(() => {
      lightbox.classList.add('book-open');
      playSound(soundOpen);
    }, CROSSFADE_DURATION);
  }

  function closeBook() {
    if (!lightbox) return;
    const wasOpen = lightbox.classList.contains('book-open');
    if (wasOpen) playSound(soundClose);
    lightbox.classList.remove('book-open');
    const delay = wasOpen ? BOOK_OPEN_DURATION : 0;
    setTimeout(() => {
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.classList.remove('is-open');
      body.style.overflow = '';
      if (bookPageArt) bookPageArt.style.backgroundImage = '';
      if (bookCrossfadeArt) bookCrossfadeArt.style.backgroundImage = '';
    }, delay);
  }

  galleryLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const imgEl = link.querySelector('.gallery-image');
      const titleEl = link.querySelector('.gallery-title');
      const mediumEl = link.querySelector('.gallery-medium');
      if (imgEl) {
        const classes = imgEl.className.split(/\s+/);
        const galleryClass = classes.find((c) => c.startsWith('gallery-image-'));
        if (galleryClass) {
          const num = galleryClass.replace('gallery-image-', '');
          const imgSrc = `assets/gallery/gallery-${num}.png`;
          const title = titleEl ? titleEl.textContent : `Work ${num}`;
          const medium = mediumEl ? mediumEl.textContent : '';
          const preload = new Image();
          preload.onload = () => openBook(imgSrc, title, medium);
          preload.onerror = () => openBook(imgSrc, title, medium);
          preload.src = imgSrc;
        }
      }
    });
  });

  waxSealClose?.addEventListener('click', (e) => { e.stopPropagation(); closeBook(); });
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeBook();
  });
  book?.addEventListener('click', (e) => {
    if (lightbox?.classList.contains('book-open')) closeBook();
  });

  // ----- Magic glow: follow mouse on inner pages when book is open (spring-like) -----
  const bookInner = document.getElementById('book-inner');
  const magicGlow = document.getElementById('book-magic-glow');
  if (bookInner && magicGlow) {
    let glowX = 0;
    let glowY = 0;
    let targetX = 0;
    let targetY = 0;
    const springFactor = 0.12;

    function setGlowPosition(x, y) {
      magicGlow.style.left = x + 'px';
      magicGlow.style.top = y + 'px';
    }

    bookInner.addEventListener('mousemove', (e) => {
      if (!lightbox?.classList.contains('book-open')) return;
      const rect = bookInner.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

    bookInner.addEventListener('mouseleave', () => {
      const rect = bookInner.getBoundingClientRect();
      targetX = rect.width / 2;
      targetY = rect.height / 2;
    });

    function tickGlow() {
      if (lightbox?.classList.contains('book-open')) {
        glowX += (targetX - glowX) * springFactor;
        glowY += (targetY - glowY) * springFactor;
        setGlowPosition(glowX, glowY);
      } else {
        const rect = bookInner.getBoundingClientRect();
        glowX = targetX = rect.width / 2;
        glowY = targetY = rect.height / 2;
        setGlowPosition(glowX, glowY);
      }
      requestAnimationFrame(tickGlow);
    }
    const rect = bookInner.getBoundingClientRect();
    glowX = targetX = rect.width / 2;
    glowY = targetY = rect.height / 2;
    setGlowPosition(glowX, glowY);
    tickGlow();
  }

  // ----- Header scroll background (mobile) -----
  const header = document.querySelector('.header');
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    if (y > 60) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
    lastY = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Parallax on gallery images: desktop only (smoother on touch) -----
  if (!prefersReducedMotion && hasFinePointer) {
    const galleryItems = document.querySelectorAll('.gallery-item[data-speed]');
    let ticking = false;

    galleryItems.forEach((item) => {
      const img = item.querySelector('.gallery-image');
      item.addEventListener('mouseenter', () => { if (img) img.dataset.parallaxPause = '1'; });
      item.addEventListener('mouseleave', () => { if (img) delete img.dataset.parallaxPause; });
    });

    function parallax() {
      const vh = window.innerHeight;
      galleryItems.forEach((item) => {
        const img = item.querySelector('.gallery-image');
        if (img?.dataset.parallaxPause) {
          img.style.transform = '';
          return;
        }
        const rect = item.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const fromCenter = center - vh / 2;
        const speed = parseFloat(item.getAttribute('data-speed')) || 0.05;
        const y = fromCenter * speed;
        if (img) img.style.transform = `translate3d(0, ${y}px, 0) scale(1.02)`;
      });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
