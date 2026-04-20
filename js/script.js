/* ══════════════════════════════════════════════════════
   Alterity Labs — Video Experts for Brands That Want to Stand Out
   script.js
══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────
   1. LOADER
───────────────────────────────────────────────────── */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const numEl   = document.getElementById('loaderNum');
  const bar     = loader.querySelector('.loader-bar');
  let progress  = 0;
  let rafId;

  function updateLoader(val) {
    bar.style.setProperty('--progress', val / 100);
    numEl.textContent = Math.floor(val);
  }

  function animateLoader() {
    const target = 100;
    const speed  = 1.4 + Math.random() * 1.2;
    progress = Math.min(progress + speed, target);
    updateLoader(progress);

    if (progress < target) {
      rafId = requestAnimationFrame(animateLoader);
    } else {
      updateLoader(100);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        startPageAnimations();
      }, 400);
    }
  }

  document.body.style.overflow = 'hidden';
  animateLoader();
})();

/* ─────────────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let follX = 0, follY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    follX += (mouseX - follX) * 0.12;
    follY += (mouseY - follY) * 0.12;
    follower.style.left = follX + 'px';
    follower.style.top  = follY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state
  const hoverEls = document.querySelectorAll('a, button, .work-card, .filter-btn, .testi-prev, .testi-next, .vp-play-circle');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─────────────────────────────────────────────────────
   3. NAV SCROLL BEHAVIOUR
───────────────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ─────────────────────────────────────────────────────
   4. BURGER / MOBILE MENU
───────────────────────────────────────────────────── */
(function initBurger() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  const links  = menu.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ─────────────────────────────────────────────────────
   5. PARTICLE CANVAS
───────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3 - 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? '#e8c46a' : '#ffffff';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -2 || this.x < -2 || this.x > W + 2) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  animate();
})();

/* ─────────────────────────────────────────────────────
   6. TYPEWRITER
───────────────────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'high-impact video editing.',
    'content built for engagement.',
    'websites & web applications.',
    'mobile apps that stand out.',
    'creative support for your brand.'
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const full = phrases[pi];
    el.textContent = deleting
      ? full.substring(0, ci--)
      : full.substring(0, ci++);

    let delay = deleting ? 40 : 80;
    if (!deleting && ci === full.length + 1) {
      delay = 2000;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 2000);
})();

/* ─────────────────────────────────────────────────────
   7. COUNTER ANIMATION
───────────────────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();

  function update(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ─────────────────────────────────────────────────────
   8. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
───────────────────────────────────────────────────── */
(function initScrollAnimations() {
  // General data-animate elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Counters
        entry.target.querySelectorAll('[data-count]').forEach(el => animateCounter(el));
        // Skill bars
        entry.target.querySelectorAll('.skill-fill').forEach(el => {
          el.style.width = el.dataset.pct + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  // Also trigger counters when the hero section is visible (they're in hero)
  const heroSection = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => animateCounter(el));
      heroObserver.disconnect();
    }
  }, { threshold: 0.3 });
  if (heroSection) heroObserver.observe(heroSection);

  // Process steps
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.process-step').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
    stepObserver.observe(el);
  });

  // Skill fills triggered individually
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

  // Line-reveal spans inside section-titles
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.line-reveal').forEach((span, i) => {
          span.style.transform = 'translateY(0)';
          span.style.opacity = '1';
          span.style.transitionDelay = (i * 0.15) + 's';
        });
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section-title, .about-title, .contact-title').forEach(el => {
    el.querySelectorAll('.line-reveal').forEach(span => {
      span.style.transform = 'translateY(40px)';
      span.style.opacity   = '0';
      span.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
    });
    lineObserver.observe(el);
  });
})();

/* ─────────────────────────────────────────────────────
   9. PAGE START ANIMATIONS (called after loader)
───────────────────────────────────────────────────── */
function startPageAnimations() {
  // Trigger hero title words — already CSS-animated with delays
  // This function can add additional entrance logics if needed
  document.querySelector('.hero')?.classList.add('loaded');
}

/* ─────────────────────────────────────────────────────
   10. PARALLAX
───────────────────────────────────────────────────── */
(function initParallax() {
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // Orbs drift with scroll
        document.querySelectorAll('.orb-1, .orb-2').forEach((orb, i) => {
          const speed = i === 0 ? 0.08 : 0.05;
          orb.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────────────────
   11. WORK FILTER
───────────────────────────────────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        // Re-trigger reveal animation
        if (show) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(40px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        }
      });

      // Re-check featured span
      const featured = document.querySelector('.work-card.featured');
      if (featured) {
        if (filter === 'all' || featured.dataset.category === filter) {
          featured.style.gridColumn = (filter === 'all') ? 'span 3' : 'span 1';
        }
      }
    });
  });
})();

/* ─────────────────────────────────────────────────────
   12. SHOWREEL — Instagram iframe player + playlist
───────────────────────────────────────────────────── */
(function initShowreelPlayer() {
  const playlist    = document.getElementById('srPlaylist');
  const iframe      = document.getElementById('srIframe');
  const loader      = document.getElementById('srLoader');
  const placeholder = document.getElementById('srPlaceholder');
  const npLabel     = document.getElementById('srNpLabel');
  if (!playlist || !iframe) return;

  // Wait for config to be available
  if (typeof INSTAGRAM_CONFIG === 'undefined' || !INSTAGRAM_CONFIG.showreelPosts) return;

  const posts = INSTAGRAM_CONFIG.showreelPosts;
  let activeIdx = -1;

  /* Build playlist items */
  posts.forEach((post, i) => {
    const item = document.createElement('div');
    item.className = 'sr-item' + (i === 0 ? ' active' : '');
    item.innerHTML = `
      <div class="sr-item-num">${post.tag}</div>
      <div class="sr-item-body">
        <span class="sr-item-text">${post.label}</span>
        <span class="sr-item-time">${post.time}</span>
      </div>
      <div class="sr-item-play">
        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>`;
    item.addEventListener('click', () => loadPost(i));
    playlist.appendChild(item);
  });

  /* Convert Instagram post URL → embed iframe src */
  function toEmbedUrl(url) {
    // handles /p/ posts and /reel/ reels
    const clean = url.trim().replace(/\/$/, '');
    return clean + '/embed/captioned/';
  }

  /* Load a post into the iframe */
  function loadPost(idx) {
    const post = posts[idx];
    if (!post || !post.url || post.url.includes('PASTE_')) {
      showPlaceholder(true);
      return;
    }

    // Mark active playlist item
    playlist.querySelectorAll('.sr-item').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
    activeIdx = idx;

    // Show loader, hide placeholder, set iframe src
    showPlaceholder(false);
    loader.style.display = 'flex';
    iframe.style.opacity = '0';
    iframe.src = toEmbedUrl(post.url);

    // Update now-playing label
    if (npLabel) npLabel.textContent = post.label;

    iframe.onload = () => {
      loader.style.display = 'none';
      iframe.style.opacity = '1';
    };
  }

  function showPlaceholder(show) {
    placeholder.style.display = show ? 'flex' : 'none';
    iframe.style.display      = show ? 'none' : 'block';
    if (show) loader.style.display = 'none';
  }

  /* Check if any URLs are configured */
  const hasRealUrl = posts.some(p => p.url && !p.url.includes('PASTE_'));

  if (hasRealUrl) {
    showPlaceholder(false);
    loadPost(0); // auto-load first reel
  } else {
    showPlaceholder(true);
    // Still build the playlist so user can see the structure
  }
})();

/* ─────────────────────────────────────────────────────
   13. TESTIMONIAL SLIDER
───────────────────────────────────────────────────── */
(function initSlider() {
  const track  = document.getElementById('testiTrack');
  const prev   = document.getElementById('testiPrev');
  const next   = document.getElementById('testiNext');
  const dots   = document.querySelectorAll('.testi-dot');
  if (!track) return;

  let current = 0;
  const total = dots.length;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Auto advance
  let autoTimer = setInterval(() => goTo(current + 1), 5500);
  [prev, next].forEach(b => {
    b.addEventListener('click', () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5500);
    });
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });
})();

/* ─────────────────────────────────────────────────────
   14. CONTACT FORM
───────────────────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const textEl = btn.querySelector('.btn-text');
    const original = textEl.textContent;

    textEl.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      textEl.textContent = 'Message Sent!';
      btn.style.background = '#4cf0b8';
      setTimeout(() => {
        textEl.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
        // Reset label positions
        form.querySelectorAll('.form-label').forEach(l => {
          l.style.transform = '';
          l.style.fontSize  = '';
          l.style.color     = '';
        });
      }, 3000);
    }, 1500);
  });
})();

/* ─────────────────────────────────────────────────────
   15. SMOOTH ANCHOR SCROLLING
───────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────────────
   16. HERO TITLE MAGNETIC HOVER
───────────────────────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.word-inner').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.08;
      const dy = (e.clientY - cy) * 0.08;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────────────────
   17. GLITCH TEXT EFFECT on hover for nav-logo
───────────────────────────────────────────────────── */
(function initGlitch() {
  const logo = document.querySelector('.nav-logo-text');
  if (!logo) return;
  const original = logo.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$% ';

  logo.addEventListener('mouseenter', () => {
    let iterations = 0;
    const interval = setInterval(() => {
      logo.textContent = original
        .split('')
        .map((letter, i) => {
          if (i < iterations) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      if (iterations >= original.length) clearInterval(interval);
      iterations += 0.5;
    }, 40);
  });
})();

/* ─────────────────────────────────────────────────────
   18. TILT EFFECT on work cards
───────────────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
})();

/* ─────────────────────────────────────────────────────
   19. SHOWREEL WHEEL — SECTION SCROLL TEXT SYNC
───────────────────────────────────────────────────── */
(function initShowreelScroll() {
  const wrapper = document.getElementById('showreelWrapper');
  if (!wrapper) return;

  const titleSpans = document.querySelectorAll('.showreel-title span');

  const wrapObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      titleSpans.forEach((span, i) => {
        span.style.transitionDelay = (i * 0.08) + 's';
        span.style.transform = 'translateY(0)';
        span.style.opacity = '1';
      });
    }
  }, { threshold: 0.3 });

  // Initial state
  titleSpans.forEach(span => {
    span.style.transform = 'translateY(30px)';
    span.style.opacity = '0';
    span.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease';
    span.style.display = 'inline-block';
  });

  const showreelSection = document.querySelector('.showreel');
  if (showreelSection) wrapObserver.observe(showreelSection);
})();

/* ─────────────────────────────────────────────────────
   20. VIDEO PLACEHOLDER — animated gradient shift
───────────────────────────────────────────────────── */
(function initVideoPlaceholder() {
  const vp = document.getElementById('videoPlaceholder');
  if (!vp) return;

  // Hide placeholder if video loads
  const video = document.querySelector('.showreel-video');
  if (video) {
    video.addEventListener('canplay', () => {
      vp.style.opacity = '0';
      vp.style.pointerEvents = 'none';
    });
    video.addEventListener('error', () => {
      vp.style.display = 'flex';
    });
  }
})();

/* ─────────────────────────────────────────────────────
   21. FOOTER BIG TEXT PARALLAX
───────────────────────────────────────────────────── */
(function initFooterParallax() {
  const bigText = document.querySelector('.footer-big-text');
  if (!bigText) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      bigText.style.opacity = '1';
      bigText.style.transform = 'translateX(0)';
    }
  }, { threshold: 0.1 });

  bigText.style.opacity = '0';
  bigText.style.transform = 'translateX(-60px)';
  bigText.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)';
  observer.observe(bigText);
})();

/* ─────────────────────────────────────────────────────
   22. BACKGROUND NOISE ANIMATION (subtle flicker)
───────────────────────────────────────────────────── */
(function initGrainAnim() {
  const grains = document.querySelectorAll('.grain');
  let frame = 0;
  function flicker() {
    frame++;
    if (frame % 3 === 0) {
      grains.forEach(g => {
        g.style.transform = `translate(${(Math.random()-0.5)*4}px, ${(Math.random()-0.5)*4}px)`;
      });
    }
    requestAnimationFrame(flicker);
  }
  flicker();
})();

/* ─────────────────────────────────────────────────────
   23. INSTAGRAM CONFIG — wire up post URLs
───────────────────────────────────────────────────── */
(function initInstagramConfig() {
  if (typeof INSTAGRAM_CONFIG === 'undefined') return;

  // Wire showreel Instagram button
  const showreelIgBtn = document.getElementById('showreelIgBtn');
  const showreelPlayBtn = document.getElementById('showreelPlayBtn');
  const cfg = INSTAGRAM_CONFIG;

  if (showreelIgBtn && cfg.showreel && !cfg.showreel.includes('PASTE_YOUR')) {
    showreelIgBtn.href = cfg.showreel;
    if (showreelPlayBtn) {
      showreelPlayBtn.style.cursor = 'pointer';
      showreelPlayBtn.addEventListener('click', () => openIgModal(cfg.showreel));
    }
  }

  // Wire work card "View Project" links to open modal
  if (cfg.projects && cfg.projects.length) {
    cfg.projects.forEach(proj => {
      const card = document.querySelector(`[data-ig-id="${proj.id}"]`);
      if (!card) return;
      const link = card.querySelector('.card-link');
      if (!link) return;

      if (proj.postUrl && !proj.postUrl.includes('PASTE_POST')) {
        link.href = '#';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openIgModal(proj.postUrl);
        });
      } else {
        // Not configured — link to profile
        link.href = cfg.profileUrl || 'https://www.instagram.com/portfolio.showcase/';
        link.target = '_blank';
        link.rel = 'noopener';
      }
    });
  }
})();

/* ─────────────────────────────────────────────────────
   24. INSTAGRAM EMBED MODAL
───────────────────────────────────────────────────── */
(function initIgModal() {
  const modal    = document.getElementById('igModal');
  const inner    = document.getElementById('igModalInner');
  const closeBtn = document.getElementById('igModalClose');
  const backdrop = document.getElementById('igModalBackdrop');
  if (!modal) return;

  window.openIgModal = function(postUrl) {
    // Show loading
    inner.innerHTML = '<div class="ig-modal-loading">Loading Instagram Post…</div>';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (!postUrl || postUrl.includes('PASTE_')) {
      showNotConfigured();
      return;
    }

    // Inject official Instagram embed blockquote
    const clean = postUrl.split('?')[0].replace(/\/$/, '');
    inner.innerHTML = `
      <blockquote
        class="instagram-media"
        data-instgrm-permalink="${clean}/?utm_source=ig_embed"
        data-instgrm-version="14"
        style="background:#fff;border:0;border-radius:3px;box-shadow:0 0 1px 0 rgba(0,0,0,.5),0 1px 10px 0 rgba(0,0,0,.15);margin:0 auto;max-width:480px;min-width:280px;padding:0;width:99.375%;">
      </blockquote>`;

    // Re-process embeds
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    } else {
      // Script not yet loaded — wait and retry
      const wait = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
          window.instgrm.Embeds.process();
          clearInterval(wait);
        }
      }, 300);
    }
  };

  function showNotConfigured() {
    inner.innerHTML = `
      <div class="ig-not-configured">
        <h4>Post URL Not Set</h4>
        <p>Open <strong>js/instagram-config.js</strong> and paste your Instagram post URL into the matching slot:</p>
        <code>postUrl: 'https://www.instagram.com/p/YOUR_POST_ID/'</code>
        <a href="https://www.instagram.com/portfolio.showcase/" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          See Portfolio on Instagram
        </a>
      </div>`;
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { inner.innerHTML = ''; }, 400);
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();

console.log('%cAlterity Labs — Video Experts for Brands That Want to Stand Out', 'color:#e8c46a;font-family:monospace;font-size:14px;font-weight:bold;');
console.log('%cVideo-first creative agency. Built for brands that grow.', 'color:#888;font-size:11px;');
