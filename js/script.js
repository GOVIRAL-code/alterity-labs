/* ══════════════════════════════════════════════════════
   Alterity Labs — Video Experts for Brands That Want to Stand Out
   script.js
══════════════════════════════════════════════════════ */

'use strict';

/* Global: detect file:// protocol — YouTube embeds block with Error 153 locally */
const isLocalFile = window.location.protocol === 'file:';

// Sync dashboard configuration from localStorage into INSTAGRAM_CONFIG if present
(function syncConfig() {
  if (typeof window.INSTAGRAM_CONFIG === 'undefined') return;
  try {
    const raw = localStorage.getItem('alterity_video_config');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        if (parsed.showreelPosts && window.INSTAGRAM_CONFIG.showreelPosts) {
          parsed.showreelPosts.forEach((post, i) => {
            if (i < window.INSTAGRAM_CONFIG.showreelPosts.length) {
              window.INSTAGRAM_CONFIG.showreelPosts[i].url = post.url || window.INSTAGRAM_CONFIG.showreelPosts[i].url;
              window.INSTAGRAM_CONFIG.showreelPosts[i].label = post.label || window.INSTAGRAM_CONFIG.showreelPosts[i].label;
              window.INSTAGRAM_CONFIG.showreelPosts[i].time = post.time || window.INSTAGRAM_CONFIG.showreelPosts[i].time;
            }
          });
        }
        if (parsed.projects && window.INSTAGRAM_CONFIG.projects) {
          parsed.projects.forEach((proj, i) => {
            const match = window.INSTAGRAM_CONFIG.projects.find(p => p.id === proj.id);
            if (match) {
              match.postUrl = proj.postUrl || match.postUrl;
              match.previewUrl = proj.previewUrl || match.previewUrl;
            }
          });
        }
        if (parsed.profileUrl) {
          window.INSTAGRAM_CONFIG.profileUrl = parsed.profileUrl;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to sync localStorage with INSTAGRAM_CONFIG:', e);
  }
})();

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
   2. CUSTOM CURSOR  (desktop only — hidden on touch)
───────────────────────────────────────────────────── */
(function initCursor() {
  // Detect touch device — skip cursor entirely
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (isTouch) {
    // Immediately hide both elements and restore default cursor
    if (cursor)   { cursor.style.display   = 'none'; }
    if (follower) { follower.style.display = 'none'; }
    document.body.style.cursor = 'auto';
    return; // do nothing else
  }

  let mouseX = 0, mouseY = 0;
  let follX  = 0, follY  = 0;
  let rafRunning = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.translate = `${mouseX}px ${mouseY}px 0px`;
    if (!rafRunning) {
      rafRunning = true;
      requestAnimationFrame(animateFollower);
    }
  });

  // Hide cursor when mouse leaves the window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });

  function animateFollower() {
    follX += (mouseX - follX) * 0.12;
    follY += (mouseY - follY) * 0.12;
    follower.style.translate = `${follX}px ${follY}px 0px`;
    requestAnimationFrame(animateFollower);
  }

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
   5. PARTICLE CANVAS (disabled on mobile for performance)
───────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  // Skip particles entirely on mobile — saves CPU & battery
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch || window.innerWidth < 768) {
    canvas.style.display = 'none';
    return;
  }

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
    particles = Array.from({ length: 60 }, () => new Particle()); // reduced from 120
  }

  let rafId;
  let isVisible = true;

  function animate() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) animate();
      else cancelAnimationFrame(rafId);
    }, { threshold: 0 });
    heroObserver.observe(heroSection);
  } else {
    animate();
  }
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
  const target   = parseInt(el.dataset.count, 10);
  const duration = 2000;
  const start    = performance.now();

  el.classList.add('animated');

  function update(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    // quartic ease-out — fast start, graceful finish
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
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
   10. PARALLAX (desktop only — skip on mobile)
───────────────────────────────────────────────────── */
(function initParallax() {
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch || window.innerWidth < 768) return; // no parallax on mobile

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        document.querySelectorAll('.orb-wrapper').forEach((orb, i) => {
          const speed = i === 0 ? 0.08 : 0.05;
          orb.style.transform = `translate3d(0, ${y * speed}px, 0)`;
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

      /* Show / hide cards — CSS data-ratio rules handle sizing */
      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);

        /* Clear any stale inline gridColumn from previous filter sessions */
        card.style.gridColumn = '';

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
    });
  });
})();


/* ─────────────────────────────────────────────────────
   12. SHOWREEL PLAYER — YouTube & Instagram supported
───────────────────────────────────────────────────── */
(function initShowreelPlayer() {
  const playlist    = document.getElementById('srPlaylist');
  const iframe      = document.getElementById('srIframe');
  const loader      = document.getElementById('srLoader');
  const placeholder = document.getElementById('srPlaceholder');
  const npLabel     = document.getElementById('srNpLabel');
  const playerFrame = document.getElementById('srPlayerFrame');
  if (!playlist || !iframe) return;

  if (typeof INSTAGRAM_CONFIG === 'undefined' || !INSTAGRAM_CONFIG.showreelPosts) return;

  const posts = INSTAGRAM_CONFIG.showreelPosts;
  let activeIdx = -1;

  /* ── Detect video type ── */
  function getType(url) {
    if (!url) return null;
    if (/youtu\.be\/|youtube\.com/.test(url)) return 'youtube';
    if (/instagram\.com/.test(url))           return 'instagram';
    return 'unknown';
  }

  /* ── Extract YouTube video ID ── */
  function getYouTubeId(url) {
    // handles youtu.be/ID, watch?v=ID, shorts/ID, embed/ID
    const patterns = [
      /youtu\.be\/([^?&\n]+)/,
      /youtube\.com\/shorts\/([^?&\n]+)/,
      /[?&]v=([^?&\n]+)/,
      /youtube\.com\/embed\/([^?&\n]+)/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  }

  /* ── Build embed URL for any supported type ── */
  function toEmbedUrl(url) {
    const type = getType(url);

    if (type === 'youtube') {
      const id = getYouTubeId(url);
      if (!id) return '';
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&rel=0&playlist=${id}&controls=0&modestbranding=1`;
    }

    if (type === 'instagram') {
      const clean = url.trim().replace(/\/$/, '');
      return clean + '/embed/?autoplay=1&muted=1';
    }

    return url; // fallback — try as-is
  }

  /* ── Switch player aspect ratio ── */
  function setAspect(url) {
    if (!playerFrame) return;
    const type = getType(url);
    if (type === 'youtube') {
      // YouTube: landscape 16:9
      playerFrame.style.aspectRatio = '16/9';
      playerFrame.style.maxWidth    = '100%';
    } else {
      // Instagram Reels / Posts: portrait 9:16
      playerFrame.style.aspectRatio = '9/16';
      playerFrame.style.maxWidth    = '420px';
    }
  }

  /* ── Build playlist items ── */
  posts.forEach((post, i) => {
    const item = document.createElement('div');
    item.className = 'sr-item' + (i === 0 ? ' active' : '');
    const type = getType(post.url);
    const typeIcon = type === 'youtube'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:12px;height:12px;opacity:0.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42C1 8.14 1 11.72 1 11.72s0 3.58.46 5.3a2.78 2.78 0 001.95 1.96C5.12 19.44 12 19.44 12 19.44s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96C23 15.3 23 11.72 23 11.72s0-3.58-.46-5.3z"/><polygon points="9.75 15.02 15.5 11.72 9.75 8.42 9.75 15.02"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:12px;height:12px;opacity:0.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/></svg>`;

    item.innerHTML = `
      <div class="sr-item-num">${post.tag}</div>
      <div class="sr-item-body">
        <span class="sr-item-text">${post.label}</span>
        <span class="sr-item-time">${typeIcon} ${post.time}</span>
      </div>
      <div class="sr-item-play">
        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>`;
    item.addEventListener('click', () => loadPost(i));
    playlist.appendChild(item);
  });

  /* ── Load a video into the player ── */
  function loadPost(idx) {
    const post = posts[idx];
    if (!post || !post.url || post.url.includes('PASTE_') || post.url.trim() === '') {
      showPlaceholder(true);
      return;
    }

    playlist.querySelectorAll('.sr-item').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
    activeIdx = idx;

    setAspect(post.url);

    /* ── file:// protocol fallback for YouTube ── */
    if (isLocalFile && getType(post.url) === 'youtube') {
      showPlaceholder(false);
      loader.style.display = 'none';
      iframe.style.display = 'none';
      /* Show elegant local preview notice */
      let notice = playerFrame.querySelector('.sr-local-notice');
      if (!notice) {
        notice = document.createElement('div');
        notice.className = 'sr-local-notice';
        notice.innerHTML = `
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
            background:linear-gradient(135deg,#0a0a12 0%,#141428 50%,#0d0d1a 100%);border-radius:8px;padding:32px;text-align:center;z-index:10;">
            <div style="width:64px;height:64px;border-radius:50%;background:rgba(232,196,106,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="#e8c46a" stroke-width="1.5" style="width:28px;height:28px;">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42C1 8.14 1 11.72 1 11.72s0 3.58.46 5.3a2.78 2.78 0 001.95 1.96C5.12 19.44 12 19.44 12 19.44s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96C23 15.3 23 11.72 23 11.72s0-3.58-.46-5.3z"/>
                <polygon points="9.75 15.02 15.5 11.72 9.75 8.42 9.75 15.02"/>
              </svg>
            </div>
            <p style="color:#e8c46a;font-size:0.85rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px;">Local Preview Mode</p>
            <p style="color:#999;font-size:0.82rem;line-height:1.6;margin:0 0 20px;max-width:280px;">YouTube embeds require a web server. Use <strong style="color:#ccc;">Live Server</strong> or click below to watch directly.</p>
            <a href="#" class="sr-local-yt-btn" style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;background:rgba(232,196,106,0.15);
              color:#e8c46a;border:1px solid rgba(232,196,106,0.3);border-radius:4px;font-size:0.78rem;font-weight:600;letter-spacing:0.06em;
              text-transform:uppercase;text-decoration:none;transition:all 0.3s;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Watch on YouTube
            </a>
          </div>`;
        playerFrame.style.position = 'relative';
        playerFrame.appendChild(notice);
      }
      notice.style.display = 'block';
      /* Wire the button to open the current post URL */
      const btn = notice.querySelector('.sr-local-yt-btn');
      if (btn) {
        btn.href = post.url;
        btn.target = '_blank';
        btn.rel = 'noopener';
      }
      if (npLabel) npLabel.textContent = post.label + ' (opens in new tab)';
      return;
    }

    /* ── Normal web server path — embed inline ── */
    /* Hide any previous local notice */
    const notice = playerFrame.querySelector('.sr-local-notice');
    if (notice) notice.style.display = 'none';

    showPlaceholder(false);
    loader.style.display = 'flex';
    iframe.style.display = 'block';
    iframe.style.opacity = '0';
    iframe.src = toEmbedUrl(post.url);

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

  /* ── Auto-load first real URL ── */
  const firstReal = posts.findIndex(p => p.url && !p.url.includes('PASTE_') && p.url.trim() !== '');
  if (firstReal !== -1) {
    showPlaceholder(false);
    setAspect(posts[firstReal].url);
    loadPost(firstReal);
  } else {
    showPlaceholder(true);
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
   16. HERO TITLE MAGNETIC HOVER — disabled (conflicts
       with word-reveal CSS animation)
───────────────────────────────────────────────────── */
// Magnetic hover removed — it was overriding the CSS
// word-reveal transform and causing the glitch effect.

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
   18. SMOOTH TILT on work cards (desktop only, GPU-safe)
───────────────────────────────────────────────────── */
(function initTilt() {
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return;

  document.querySelectorAll('.work-card').forEach(card => {
    let rafId;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let hovering = false;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width  - 0.5) * 7;
      targetY = ((e.clientY - rect.top)  / rect.height - 0.5) * -5;
    });

    card.addEventListener('mouseenter', () => {
      hovering = true;
      card.style.transition = 'border-color 0.4s, box-shadow 0.4s';
      function loop() {
        if (!hovering) return;
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        card.style.transform = `perspective(900px) rotateY(${currentX}deg) rotateX(${currentY}deg) translateY(-6px)`;
        rafId = requestAnimationFrame(loop);
      }
      loop();
    });

    card.addEventListener('mouseleave', () => {
      hovering = false;
      cancelAnimationFrame(rafId);
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s';
      card.style.transform = '';
      targetX = 0; targetY = 0;
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
   22. FORCE AUTOPLAY — all videos always playing
───────────────────────────────────────────────────── */
(function forceAutoplay() {
  function enforcePlay(video) {
    video.muted   = true;
    video.autoplay = true;
    video.loop    = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('disablePictureInPicture', '');
    video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
    video.removeAttribute('controls');

    const tryPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('pause',  tryPlay);
    video.addEventListener('ended',  tryPlay);
    video.addEventListener('canplay', tryPlay);
    tryPlay();
  }

  // Enforce on all existing videos
  document.querySelectorAll('video').forEach(enforcePlay);

  // Poster: user gesture re-triggers play on mobile
  document.addEventListener('touchstart', () => {
    document.querySelectorAll('video').forEach(v => {
      if (v.paused) v.play().catch(() => {});
    });
  }, { once: false, passive: true });
})();

/* ─────────────────────────────────────────────────────
   22b. BACKGROUND NOISE ANIMATION (desktop only)
───────────────────────────────────────────────────── */
// Removed JS-based grain animation. Handled by GPU-accelerated CSS now.

/* Helper: detect type */
function urlType(url) {
  if (!url) return null;
  if (/youtu\.be\/|youtube\.com/.test(url)) return 'youtube';
  if (/instagram\.com/.test(url))           return 'instagram';
  return null;
}

/* Helper: extract YouTube ID */
function ytId(url) {
  if (!url) return null;
  let m = url.match(/youtu\.be\/([^?&#]+)/);
  if (m) return m[1];
  m = url.match(/\/shorts\/([^?&#]+)/);
  if (m) return m[1];
  m = url.match(/\/embed\/([^?&#]+)/);
  if (m) return m[1];
  m = url.match(/[?&]v=([^?&#]+)/);
  if (m) return m[1];
  return null;
}

/* ─────────────────────────────────────────────────────
   23. INSTAGRAM CONFIG — wire up post URLs
───────────────────────────────────────────────────── */
(function initInstagramConfig() {
  if (typeof INSTAGRAM_CONFIG === 'undefined') return;
  const cfg = INSTAGRAM_CONFIG;

  /* Helper: URL → embed src with autoplay */
  function toEmbed(url) {
    if (!url) return '';
    const t = urlType(url);
    if (t === 'youtube') {
      const id = ytId(url);
      if (!id) return '';
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
    }
    if (t === 'instagram') {
      return url.trim().replace(/\/$/, '') + '/embed/?autoplay=1&muted=1';
    }
    return '';
  }

  /* Helper: check if a URL is real (not a placeholder and not empty) */
  function isReal(url) {
    return url && !url.includes('PASTE_') && url.trim() !== '';
  }

  /* ── Wire card preview iframes + modal links ── */
  if (cfg.projects && cfg.projects.length) {
    cfg.projects.forEach((proj, i) => {
      const card    = document.querySelector(`[data-ig-id="${proj.id}"]`);
      if (!card) return;

      const link    = card.querySelector('.card-link');
      const iframe  = document.getElementById(`card-iframe-${i + 1}`);

      /* 0. Dynamic aspect ratio detection */
      let ratio = 'landscape';
      if (isReal(proj.previewUrl)) {
        const lowerUrl = proj.previewUrl.toLowerCase();
        if (lowerUrl.includes('/shorts/') || lowerUrl.includes('instagram.com') || lowerUrl.includes('/reel/')) {
          ratio = 'portrait';
        }
      }
      card.setAttribute('data-ratio', ratio);

      /* 1. Inject background preview iframe with delay on hover, unload on leave */
      /* Skip iframe previews on file:// — they trigger YouTube Error 153 */
      if (iframe && isReal(proj.previewUrl) && !isLocalFile) {
        let hoverTimer;
        card.addEventListener('mouseenter', () => {
          hoverTimer = setTimeout(() => {
            // Always attach event listener before setting src to avoid race conditions
            iframe.onload = () => {
              iframe.classList.add('loaded');
              const bg = card.querySelector('.card-video-bg');
              if (bg) bg.style.opacity = '0';
            };
            iframe.src = toEmbed(proj.previewUrl);
          }, 200);
        });
        card.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimer);
          iframe.src = '';
          iframe.classList.remove('loaded');
          iframe.onload = null;
          const bg = card.querySelector('.card-video-bg');
          if (bg) bg.style.opacity = '1';
        });
      }

      /* 2. Wire "View Project" to open modal */
      if (link) {
        if (isReal(proj.postUrl)) {
          link.href = '#';
          link.addEventListener('click', (e) => {
            e.preventDefault();
            openIgModal(proj.postUrl);
          });
        } else {
          link.href   = cfg.profileUrl || 'https://www.instagram.com/portfolio.showcase/';
          link.target = '_blank';
          link.rel    = 'noopener';
        }
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
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (!postUrl || postUrl.includes('PASTE_')) {
      showNotConfigured();
      return;
    }

    const t = urlType(postUrl);
    if (t === 'youtube') {
      const id = ytId(postUrl);
      if (!id) {
        inner.innerHTML = '<div class="ig-modal-loading">Invalid YouTube URL</div>';
        return;
      }
      const isShort = postUrl.includes('/shorts/');
      const aspect = isShort ? '9/16' : '16/9';
      const maxWidth = isShort ? '360px' : '800px';

      if (isLocalFile) {
        inner.innerHTML = `
          <div class="modal-video-wrapper" style="position:relative; width:100%; aspect-ratio:${aspect}; max-width:${maxWidth}; margin:0 auto; background:#000; border-radius:8px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.8); border:1px solid rgba(255,255,255,0.1);">
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
              background:linear-gradient(135deg,#0a0a12 0%,#141428 50%,#0d0d1a 100%);padding:24px;text-align:center;">
              <div style="width:56px;height:56px;border-radius:50%;background:rgba(232,196,106,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#e8c46a" stroke-width="1.5" style="width:24px;height:24px;">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42C1 8.14 1 11.72 1 11.72s0 3.58.46 5.3a2.78 2.78 0 001.95 1.96C5.12 19.44 12 19.44 12 19.44s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96C23 15.3 23 11.72 23 11.72s0-3.58-.46-5.3z"/>
                  <polygon points="9.75 15.02 15.5 11.72 9.75 8.42 9.75 15.02"/>
                </svg>
              </div>
              <p style="color:#e8c46a;font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 6px;">Local Preview Mode</p>
              <p style="color:#999;font-size:0.78rem;line-height:1.5;margin:0 0 16px;max-width:260px;">YouTube embeds require a web server to load. Click below to watch this video directly on YouTube.</p>
              <a href="${postUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:rgba(232,196,106,0.15);
                color:#e8c46a;border:1px solid rgba(232,196,106,0.3);border-radius:4px;font-size:0.75rem;font-weight:600;letter-spacing:0.06em;
                text-transform:uppercase;text-decoration:none;transition:all 0.3s;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Watch on YouTube
              </a>
            </div>
          </div>`;
        return;
      }

      inner.innerHTML = `
        <div class="modal-video-wrapper" style="position:relative; width:100%; aspect-ratio:${aspect}; max-width:${maxWidth}; margin:0 auto; background:#000; border-radius:8px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.8); border:1px solid rgba(255,255,255,0.1);">
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" 
            style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" 
            allow="autoplay; encrypted-media; picture-in-picture" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>`;
      return;
    }

    // Instagram
    // Show loading
    inner.innerHTML = '<div class="ig-modal-loading">Loading Instagram Post…</div>';

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
