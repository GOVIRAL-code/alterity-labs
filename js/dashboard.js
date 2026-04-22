/* ══════════════════════════════════════════════════════
   Alterity Labs — Video Dashboard
   Manages showreel + project card video URLs.
   Saves to localStorage → read by instagram-config.js
   on the live site.
═══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────
   AUTH — SHA-256 login gate
   Credentials are hashed in js/auth-config.js (gitignored).
   Plain-text credentials are never stored in this file.
───────────────────────────────────────────────────── */
(function initAuth() {
  const SESSION_KEY  = 'alterity_dash_session';
  const SESSION_MINS = (typeof DASHBOARD_AUTH !== 'undefined' && DASHBOARD_AUTH.sessionMinutes) || 60;

  const loginScreen = document.getElementById('dbLoginScreen');
  const loginForm   = document.getElementById('dbLoginForm');
  const loginUser   = document.getElementById('dbLoginUser');
  const loginPass   = document.getElementById('dbLoginPass');
  const loginError  = document.getElementById('dbLoginError');
  const loginBtn    = document.getElementById('dbLoginBtn');
  const logoutBtn   = document.getElementById('dbLogoutBtn');
  const pwToggle    = document.getElementById('dbPwToggle');
  const eyeShow     = document.getElementById('dbPwEyeShow');
  const eyeHide     = document.getElementById('dbPwEyeHide');

  /* ── SHA-256 via Web Crypto API ── */
  async function sha256(str) {
    const buf    = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /* ── Session helpers ── */
  function isSessionValid() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      const { expiry } = JSON.parse(raw);
      return Date.now() < expiry;
    } catch (e) { return false; }
  }

  function createSession() {
    const expiry = Date.now() + SESSION_MINS * 60 * 1000;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expiry }));
  }

  function destroySession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  /* ── Show / hide dashboard ── */
  function showDashboard() {
    loginScreen.classList.add('hidden');
  }

  function showLogin(msg) {
    loginScreen.classList.remove('hidden');
    loginUser.value = '';
    loginPass.value = '';
    if (msg) { loginError.textContent = msg; }
    setTimeout(() => loginUser.focus(), 100);
  }

  /* ── Password visibility toggle ── */
  pwToggle.addEventListener('click', () => {
    const isHidden = loginPass.type === 'password';
    loginPass.type  = isHidden ? 'text' : 'password';
    eyeShow.style.display = isHidden ? 'none'  : '';
    eyeHide.style.display = isHidden ? ''      : 'none';
  });

  /* ── Login submit ── */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    loginBtn.disabled = true;
    loginBtn.querySelector('svg').style.opacity = '0.4';

    /* If auth-config.js failed to load, deny access */
    if (typeof DASHBOARD_AUTH === 'undefined') {
      loginError.textContent = 'Auth config missing. Add js/auth-config.js locally.';
      loginBtn.disabled = false;
      loginBtn.querySelector('svg').style.opacity = '';
      return;
    }

    const [uHash, pHash] = await Promise.all([
      sha256(loginUser.value.trim()),
      sha256(loginPass.value),
    ]);

    const validUser = uHash === DASHBOARD_AUTH.usernameHash;
    const validPass = pHash === DASHBOARD_AUTH.passwordHash;

    loginBtn.disabled = false;
    loginBtn.querySelector('svg').style.opacity = '';

    if (validUser && validPass) {
      createSession();
      showDashboard();
    } else {
      loginError.textContent = 'Incorrect username or password.';
      loginPass.value = '';
      loginPass.focus();
    }
  });

  /* ── Logout ── */
  logoutBtn.addEventListener('click', () => {
    destroySession();
    showLogin('You have been logged out.');
  });

  /* ── Check session on load ── */
  if (isSessionValid()) {
    showDashboard();
  } else {
    /* Keep login screen visible, focus username */
    setTimeout(() => loginUser.focus(), 200);
  }
})();

/* ─────────────────────────────────────────────────────
   DEFAULTS  (mirrors instagram-config.js structure)
───────────────────────────────────────────────────── */
const DEFAULTS = {
  showreelPosts: [
    { url: 'https://www.instagram.com/p/Cwkc0yTIPjw/', label: 'Video Editing — Reels, Shorts, YouTube & Ads',      tag: '01', time: '00:00' },
    { url: '',                                          label: 'Creative Support — Design, Branding & Content',      tag: '02', time: '00:06' },
    { url: '',                                          label: 'Digital Development — Websites & Web Applications',  tag: '03', time: '00:12' },
    { url: '',                                          label: 'Mobile Solutions — Apps for iOS & Android',          tag: '04', time: '00:18' },
    { url: '',                                          label: 'Results — Brands That Engage, Grow & Scale Online',  tag: '05', time: '00:24' },
  ],
  projects: [
    { id: 'card-1', postUrl: '', previewUrl: '' },
    { id: 'card-2', postUrl: '', previewUrl: '' },
    { id: 'card-3', postUrl: '', previewUrl: '' },
    { id: 'card-4', postUrl: '', previewUrl: '' },
    { id: 'card-5', postUrl: '', previewUrl: '' },
    { id: 'card-6', postUrl: '', previewUrl: '' },
  ],
  profileUrl: 'https://www.instagram.com/portfolio.showcase/',
};

const STORAGE_KEY = 'alterity_video_config';

/* ─────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────── */
let config = loadConfig();
let currentPreviewUrl = '';

/* ─────────────────────────────────────────────────────
   STORAGE HELPERS
───────────────────────────────────────────────────── */
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to ensure all fields exist
      return mergeWithDefaults(parsed);
    }
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULTS));
}

function saveConfig() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    return false;
  }
}

function mergeWithDefaults(parsed) {
  const result = JSON.parse(JSON.stringify(DEFAULTS));
  if (parsed.showreelPosts) {
    parsed.showreelPosts.forEach((post, i) => {
      if (i < result.showreelPosts.length) {
        result.showreelPosts[i].url   = post.url   || '';
        result.showreelPosts[i].label = post.label || result.showreelPosts[i].label;
        result.showreelPosts[i].time  = post.time  || result.showreelPosts[i].time;
      }
    });
  }
  if (parsed.projects) {
    parsed.projects.forEach((proj, i) => {
      if (i < result.projects.length) {
        result.projects[i].postUrl    = proj.postUrl    || '';
        result.projects[i].previewUrl = proj.previewUrl || '';
      }
    });
  }
  if (parsed.profileUrl) result.profileUrl = parsed.profileUrl;
  return result;
}

/* ─────────────────────────────────────────────────────
   URL UTILITIES
───────────────────────────────────────────────────── */
function getUrlType(url) {
  if (!url || !url.trim()) return null;
  url = url.trim();
  if (/youtu\.be\/|youtube\.com/.test(url)) return 'youtube';
  if (/instagram\.com/.test(url))           return 'instagram';
  return 'unknown';
}

function getYouTubeId(url) {
  const patterns = [
    /youtu\.be\/([^?&\n/]+)/,
    /youtube\.com\/shorts\/([^?&\n/]+)/,
    /[?&]v=([^?&\n]+)/,
    /youtube\.com\/embed\/([^?&\n/]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function toEmbedUrl(url) {
  const type = getUrlType(url);
  if (type === 'youtube') {
    const id = getYouTubeId(url);
    if (!id) return '';
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&rel=0&playlist=${id}&controls=1&modestbranding=1`;
  }
  if (type === 'instagram') {
    const clean = url.trim().replace(/\/$/, '');
    return clean + '/embed/?autoplay=1&muted=1';
  }
  return url;
}

function isValidUrl(url) {
  if (!url || !url.trim()) return false;
  const type = getUrlType(url.trim());
  return type === 'youtube' || type === 'instagram';
}

function sanitizeUrl(url) {
  if (!url) return '';
  url = url.trim();
  // Strip PASTE_ placeholder strings
  if (url.includes('PASTE_')) return '';
  return url;
}

function typeLabel(type) {
  if (type === 'youtube')   return '<span class="db-badge db-badge-yt">▶ YouTube</span>';
  if (type === 'instagram') return '<span class="db-badge db-badge-ig">◎ Instagram</span>';
  return '<span class="db-badge db-badge-empty">No URL</span>';
}

/* ─────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────── */
const toast    = document.getElementById('dbToast');
const toastMsg = document.getElementById('dbToastMsg');
let toastTimer = null;

function showToast(msg, isError = false) {
  toastMsg.textContent = msg;
  toast.classList.toggle('error-toast', isError);
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

/* ─────────────────────────────────────────────────────
   TABS
───────────────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.db-nav-link');
const tabs     = document.querySelectorAll('.db-tab');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = link.dataset.tab;
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    tabs.forEach(t => t.classList.remove('active'));
    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.add('active');
    // Close sidebar on mobile
    closeSidebar();
  });
});

/* ─────────────────────────────────────────────────────
   MOBILE SIDEBAR
───────────────────────────────────────────────────── */
const sidebar  = document.getElementById('dbSidebar');
const burger   = document.getElementById('dbBurger');
let overlay    = null;

function openSidebar() {
  sidebar.classList.add('open');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'db-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeSidebar);
  }
  overlay.classList.add('visible');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
}

burger.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

/* ─────────────────────────────────────────────────────
   BUILD SHOWREEL LIST
───────────────────────────────────────────────────── */
function buildShowreelList() {
  const list = document.getElementById('showreelList');
  list.innerHTML = '';

  config.showreelPosts.forEach((post, i) => {
    const type = getUrlType(post.url);
    const valid = isValidUrl(post.url);

    const item = document.createElement('div');
    item.className = 'db-video-item';
    item.id = `sr-item-${i}`;

    item.innerHTML = `
      <div class="db-video-item-header">
        <div class="db-item-num">${post.tag}</div>
        <input
          class="db-input db-item-title-input"
          type="text"
          value="${escHtml(post.label)}"
          placeholder="Video label / title"
          data-sr-label="${i}"
          style="flex:1;background:transparent;border:none;padding:0;font-size:13px;font-weight:600;color:var(--db-text)"
        />
        <div class="db-item-actions">
          ${typeLabel(type)}
          <button class="db-btn db-btn-icon db-btn-sm db-preview-btn" data-url="${escHtml(post.url)}" title="Preview in player" ${valid ? '' : 'disabled style="opacity:0.4"'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
          <button class="db-btn db-btn-icon db-btn-icon-danger db-btn-sm db-clear-btn" data-sr-idx="${i}" title="Clear URL">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div class="db-video-item-body">
        <div class="db-field-wrap">
          <div class="db-input-action">
            <input
              type="url"
              class="db-input sr-url-input ${valid ? 'valid' : (post.url ? 'invalid' : '')}"
              id="sr-url-${i}"
              value="${escHtml(post.url)}"
              placeholder="Paste YouTube or Instagram URL here…"
              data-sr-idx="${i}"
              autocomplete="off"
              spellcheck="false"
            />
            <button class="db-btn db-btn-primary db-btn-sm db-run-sr-btn" data-sr-idx="${i}" title="Load into player">
              <svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Run
            </button>
          </div>
          <div class="db-url-status ${valid ? 'valid' : (post.url ? 'invalid' : '')}" id="sr-status-${i}">
            ${getStatusHtml(post.url, type, valid)}
          </div>
        </div>
      </div>
      <div class="db-label-row">
        <div class="db-field-wrap">
          <span class="db-label">Time Code</span>
          <input
            type="text"
            class="db-input"
            value="${escHtml(post.time)}"
            placeholder="00:00"
            data-sr-time="${i}"
            style="max-width:100px"
          />
        </div>
      </div>
    `;

    list.appendChild(item);
  });

  // Bind events
  bindShowreelEvents();
}

function getStatusHtml(url, type, valid) {
  if (!url) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>No URL — paste a link above`;
  }
  if (valid) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Valid ${type === 'youtube' ? 'YouTube' : 'Instagram'} URL`;
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Unrecognised URL format — use YouTube or Instagram links`;
}

function bindShowreelEvents() {
  // URL input changes
  document.querySelectorAll('.sr-url-input').forEach(input => {
    input.addEventListener('input', debounce(function() {
      const i   = parseInt(this.dataset.srIdx, 10);
      const url = sanitizeUrl(this.value);
      config.showreelPosts[i].url = url;
      updateSrItem(i, url);
    }, 300));

    input.addEventListener('paste', function() {
      setTimeout(() => {
        const i   = parseInt(this.dataset.srIdx, 10);
        const url = sanitizeUrl(this.value);
        config.showreelPosts[i].url = url;
        updateSrItem(i, url);
      }, 50);
    });
  });

  // Label inputs
  document.querySelectorAll('[data-sr-label]').forEach(input => {
    input.addEventListener('input', function() {
      const i = parseInt(this.dataset.srLabel, 10);
      config.showreelPosts[i].label = this.value;
    });
  });

  // Time inputs
  document.querySelectorAll('[data-sr-time]').forEach(input => {
    input.addEventListener('input', function() {
      const i = parseInt(this.dataset.srTime, 10);
      config.showreelPosts[i].time = this.value;
    });
  });

  // Clear buttons
  document.querySelectorAll('.db-clear-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const i = parseInt(this.dataset.srIdx, 10);
      config.showreelPosts[i].url = '';
      const input = document.getElementById(`sr-url-${i}`);
      if (input) { input.value = ''; }
      updateSrItem(i, '');
    });
  });

  // Run / Preview buttons
  document.querySelectorAll('.db-run-sr-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const i   = parseInt(this.dataset.srIdx, 10);
      const url = config.showreelPosts[i].url;
      if (url && isValidUrl(url)) openPreviewTab(url);
      else showToast('Enter a valid YouTube or Instagram URL first', true);
    });
  });

  // Header preview buttons
  document.querySelectorAll('.db-preview-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const url = this.dataset.url;
      if (url && isValidUrl(url)) openPreviewTab(url);
    });
  });
}

function updateSrItem(i, url) {
  const type  = getUrlType(url);
  const valid = isValidUrl(url);
  const input = document.getElementById(`sr-url-${i}`);
  const status = document.getElementById(`sr-status-${i}`);
  const item   = document.getElementById(`sr-item-${i}`);

  if (input) {
    input.classList.toggle('valid',   valid);
    input.classList.toggle('invalid', !valid && !!url);
    input.classList.remove('valid',   'invalid');
    if (valid)        input.classList.add('valid');
    else if (url)     input.classList.add('invalid');
  }

  if (status) {
    status.className = `db-url-status ${valid ? 'valid' : (url ? 'invalid' : '')}`;
    status.innerHTML = getStatusHtml(url, type, valid);
  }

  // Update header badge and preview btn
  if (item) {
    const badgeWrap = item.querySelector('.db-item-actions');
    if (badgeWrap) {
      const oldBadge = badgeWrap.querySelector('.db-badge');
      if (oldBadge) oldBadge.outerHTML = typeLabel(type).replace(/<[^>]*>/g, '') ? typeLabel(type) : '<span class="db-badge db-badge-empty">No URL</span>';
      // Actually replace properly
      const badges = badgeWrap.querySelectorAll('.db-badge');
      badges.forEach(b => b.remove());
      const tmp = document.createElement('div');
      tmp.innerHTML = typeLabel(type);
      const newBadge = tmp.firstElementChild;
      if (newBadge) badgeWrap.insertBefore(newBadge, badgeWrap.firstElementChild);
    }
    const previewBtn = item.querySelector('.db-preview-btn');
    if (previewBtn) {
      previewBtn.dataset.url = url;
      previewBtn.disabled = !valid;
      previewBtn.style.opacity = valid ? '' : '0.4';
    }
  }
}

/* ─────────────────────────────────────────────────────
   BUILD WORK CARDS LIST
───────────────────────────────────────────────────── */
const CARD_NAMES = [
  'Brand Promo Reel — Featured',
  'Viral Reels & Shorts Package',
  'Social Media Post Series',
  'Full Brand Identity Package',
  'Monthly Social Content Strategy',
  'YouTube Thumbnail Collection',
];

function buildProjectsList() {
  const list = document.getElementById('projectsList');
  list.innerHTML = '';

  config.projects.forEach((proj, i) => {
    const num = i + 1;
    const previewType = getUrlType(proj.previewUrl);
    const postType    = getUrlType(proj.postUrl);
    const previewOk   = isValidUrl(proj.previewUrl);
    const postOk      = isValidUrl(proj.postUrl);
    const bothOk      = previewOk && postOk;

    const card = document.createElement('div');
    card.className = 'db-card-item';
    card.id = `proj-item-${i}`;

    card.innerHTML = `
      <div class="db-card-item-header">
        <div class="db-card-num">${num < 10 ? '0'+num : num}</div>
        <span class="db-card-title">${escHtml(CARD_NAMES[i] || 'Card ' + num)}</span>
        <div class="db-card-status" id="proj-status-${i}">
          ${bothOk
            ? '<span class="db-badge db-badge-ok">✓ Ready</span>'
            : (previewOk || postOk
              ? '<span class="db-badge db-badge-yt" style="background:rgba(255,170,0,0.15);color:#ffaa00">⚑ Partial</span>'
              : '<span class="db-badge db-badge-empty">Empty</span>'
            )
          }
        </div>
      </div>
      <div class="db-card-fields">
        <!-- Preview URL -->
        <div class="db-field-group">
          <div class="db-field-label-row">
            <span class="db-label">Preview URL</span>
            <span class="db-field-hint">Plays silently as card background</span>
          </div>
          <div class="db-input-action">
            <input
              type="url"
              class="db-input proj-preview-input ${previewOk ? 'valid' : (proj.previewUrl ? 'invalid' : '')}"
              id="proj-preview-${i}"
              value="${escHtml(proj.previewUrl)}"
              placeholder="YouTube or Instagram URL…"
              data-proj-idx="${i}"
              data-proj-field="previewUrl"
              autocomplete="off"
              spellcheck="false"
            />
            <button class="db-btn db-btn-icon db-btn-sm db-proj-run-btn" data-url="${escHtml(proj.previewUrl)}" title="Preview" ${previewOk ? '' : 'disabled style="opacity:0.4"'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>
          <div class="db-url-status ${previewOk ? 'valid' : (proj.previewUrl ? 'invalid' : '')}" id="proj-preview-status-${i}">
            ${getStatusHtml(proj.previewUrl, previewType, previewOk)}
          </div>
        </div>
        <!-- Post URL -->
        <div class="db-field-group">
          <div class="db-field-label-row">
            <span class="db-label">Post URL</span>
            <span class="db-field-hint">Opens in popup modal</span>
          </div>
          <div class="db-input-action">
            <input
              type="url"
              class="db-input proj-post-input ${postOk ? 'valid' : (proj.postUrl ? 'invalid' : '')}"
              id="proj-post-${i}"
              value="${escHtml(proj.postUrl)}"
              placeholder="YouTube or Instagram URL…"
              data-proj-idx="${i}"
              data-proj-field="postUrl"
              autocomplete="off"
              spellcheck="false"
            />
            <button class="db-btn db-btn-icon db-btn-sm db-proj-run-btn" data-url="${escHtml(proj.postUrl)}" title="Preview" ${postOk ? '' : 'disabled style="opacity:0.4"'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>
          <div class="db-url-status ${postOk ? 'valid' : (proj.postUrl ? 'invalid' : '')}" id="proj-post-status-${i}">
            ${getStatusHtml(proj.postUrl, postType, postOk)}
          </div>
        </div>
        <!-- Copy preview → post -->
        <button class="db-btn db-btn-ghost db-btn-sm db-copy-url-btn" data-proj-idx="${i}" style="align-self:flex-start">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copy Preview URL → Post URL
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  bindProjectsEvents();
}

function bindProjectsEvents() {
  // URL inputs (both preview and post)
  document.querySelectorAll('.proj-preview-input, .proj-post-input').forEach(input => {
    const handleChange = debounce(function() {
      const i     = parseInt(this.dataset.projIdx, 10);
      const field = this.dataset.projField;
      const url   = sanitizeUrl(this.value);
      config.projects[i][field] = url;
      updateProjField(i, field, url);
    }, 300);

    input.addEventListener('input', handleChange);
    input.addEventListener('paste', function() {
      setTimeout(() => {
        const i     = parseInt(this.dataset.projIdx, 10);
        const field = this.dataset.projField;
        const url   = sanitizeUrl(this.value);
        config.projects[i][field] = url;
        updateProjField(i, field, url);
      }, 50);
    });
  });

  // Run buttons
  document.querySelectorAll('.db-proj-run-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const url = this.dataset.url;
      if (url && isValidUrl(url)) openPreviewTab(url);
      else showToast('Enter a valid URL first', true);
    });
  });

  // Copy preview → post URL
  document.querySelectorAll('.db-copy-url-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const i = parseInt(this.dataset.projIdx, 10);
      const previewVal = config.projects[i].previewUrl;
      if (!previewVal) { showToast('No Preview URL to copy', true); return; }
      config.projects[i].postUrl = previewVal;
      const postInput = document.getElementById(`proj-post-${i}`);
      if (postInput) postInput.value = previewVal;
      updateProjField(i, 'postUrl', previewVal);
      showToast('Copied Preview URL to Post URL');
    });
  });
}

function updateProjField(i, field, url) {
  const type  = getUrlType(url);
  const valid = isValidUrl(url);
  const inputId  = field === 'previewUrl' ? `proj-preview-${i}` : `proj-post-${i}`;
  const statusId = field === 'previewUrl' ? `proj-preview-status-${i}` : `proj-post-status-${i}`;

  const input  = document.getElementById(inputId);
  const status = document.getElementById(statusId);
  const runBtn = input ? input.parentElement.querySelector('.db-proj-run-btn') : null;

  if (input) {
    input.classList.remove('valid', 'invalid');
    if (valid)   input.classList.add('valid');
    else if (url) input.classList.add('invalid');
  }

  if (status) {
    status.className = `db-url-status ${valid ? 'valid' : (url ? 'invalid' : '')}`;
    status.innerHTML = getStatusHtml(url, type, valid);
  }

  if (runBtn) {
    runBtn.dataset.url = url;
    runBtn.disabled = !valid;
    runBtn.style.opacity = valid ? '' : '0.4';
  }

  // Update card status badge
  updateCardStatusBadge(i);
}

function updateCardStatusBadge(i) {
  const previewOk = isValidUrl(config.projects[i].previewUrl);
  const postOk    = isValidUrl(config.projects[i].postUrl);
  const statusEl  = document.getElementById(`proj-status-${i}`);
  if (!statusEl) return;

  if (previewOk && postOk) {
    statusEl.innerHTML = '<span class="db-badge db-badge-ok">✓ Ready</span>';
  } else if (previewOk || postOk) {
    statusEl.innerHTML = '<span class="db-badge db-badge-yt" style="background:rgba(255,170,0,0.15);color:#ffaa00">⚑ Partial</span>';
  } else {
    statusEl.innerHTML = '<span class="db-badge db-badge-empty">Empty</span>';
  }
}

/* ─────────────────────────────────────────────────────
   PREVIEW PLAYER TAB
───────────────────────────────────────────────────── */
const previewIframe      = document.getElementById('previewIframe');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const previewLoader      = document.getElementById('previewLoader');
const previewPlayer      = document.getElementById('previewPlayer');
const previewPlayerLabel = document.getElementById('previewPlayerLabel');
const previewUrlInput    = document.getElementById('previewUrl');
const previewRunBtn      = document.getElementById('previewRunBtn');
const previewUrlInfo     = document.getElementById('previewUrlInfo');
const previewUseRow      = document.getElementById('previewUseRow');
const previewUrlBadge    = document.getElementById('previewUrlBadge');
const previewUrlDisplay  = document.getElementById('previewUrlDisplay');

previewRunBtn.addEventListener('click', () => {
  const url = sanitizeUrl(previewUrlInput.value);
  if (!url) { showToast('Please enter a URL first', true); return; }
  if (!isValidUrl(url)) { showToast('Enter a valid YouTube or Instagram URL', true); return; }
  loadPreview(url);
});

previewUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') previewRunBtn.click();
});

previewUrlInput.addEventListener('paste', () => {
  setTimeout(() => {
    const url = sanitizeUrl(previewUrlInput.value);
    if (isValidUrl(url)) loadPreview(url);
  }, 80);
});

// Quick example buttons
document.querySelectorAll('.db-quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    previewUrlInput.value = url;
    loadPreview(url);
  });
});

// Use in Showreel
document.getElementById('previewUseShowreel').addEventListener('click', () => {
  if (!currentPreviewUrl) return;
  // Find first empty showreel slot
  const emptyIdx = config.showreelPosts.findIndex(p => !p.url);
  if (emptyIdx === -1) {
    showToast('All 5 showreel slots are filled — clear one first', true);
    return;
  }
  config.showreelPosts[emptyIdx].url = currentPreviewUrl;
  saveConfig();
  buildShowreelList();
  showToast(`Added to Showreel slot ${emptyIdx + 1} — click Save to apply`);
  // Switch to showreel tab
  switchTab('showreel');
});

// Use in Card
document.getElementById('previewUseCardBtn').addEventListener('click', () => {
  const cardId = document.getElementById('previewUseCardSelect').value;
  if (!cardId || !currentPreviewUrl) return;
  const idx = config.projects.findIndex(p => p.id === cardId);
  if (idx === -1) return;
  config.projects[idx].previewUrl = currentPreviewUrl;
  config.projects[idx].postUrl    = currentPreviewUrl;
  saveConfig();
  buildProjectsList();
  showToast(`URL set for ${cardId} — click Save to apply`);
  switchTab('projects');
});

function loadPreview(url) {
  currentPreviewUrl = url;
  const type = getUrlType(url);

  // Update aspect ratio
  if (type === 'youtube') {
    previewPlayer.classList.add('landscape');
    previewPlayer.style.aspectRatio = '16/9';
    previewPlayer.style.maxHeight   = 'none';
  } else {
    previewPlayer.classList.remove('landscape');
    previewPlayer.style.aspectRatio = '9/16';
    previewPlayer.style.maxHeight   = '600px';
  }

  // Show info row
  previewUrlInfo.style.display = 'flex';
  previewUrlBadge.className = 'db-url-badge ' + (type === 'youtube' ? 'yt' : 'ig');
  previewUrlBadge.textContent = type === 'youtube' ? '▶ YouTube' : '◎ Instagram';
  previewUrlDisplay.textContent = url;
  previewUseRow.style.display = 'block';

  // Show loader
  previewPlaceholder.style.display = 'none';
  previewLoader.style.display = 'flex';
  previewIframe.style.display = 'none';

  const embedUrl = toEmbedUrl(url);
  previewIframe.src = '';

  previewPlayerLabel.textContent = type === 'youtube' ? 'Loading YouTube video…' : 'Loading Instagram post…';

  setTimeout(() => {
    previewIframe.src = embedUrl;
  }, 100);

  previewIframe.onload = () => {
    previewLoader.style.display = 'none';
    previewIframe.style.display  = 'block';
    previewPlayerLabel.textContent = type === 'youtube' ? 'YouTube video' : 'Instagram post';
  };
}

function openPreviewTab(url) {
  switchTab('preview');
  previewUrlInput.value = url;
  loadPreview(url);
}

function switchTab(tabId) {
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
  tabs.forEach(t => t.classList.toggle('active', t.id === 'tab-' + tabId));
}

/* ─────────────────────────────────────────────────────
   SAVE BUTTON
───────────────────────────────────────────────────── */
document.getElementById('dbSaveBtn').addEventListener('click', () => {
  const ok = saveConfig();
  if (ok) {
    showToast('Changes saved! Reload the site to see updates.');
  } else {
    showToast('Could not save — check browser storage settings', true);
  }
});

/* ─────────────────────────────────────────────────────
   RESET BUTTON (confirm dialog)
───────────────────────────────────────────────────── */
document.getElementById('dbResetBtn').addEventListener('click', () => {
  showConfirm(
    'Reset to Defaults?',
    'This will clear all your video URLs and restore the original placeholder content.',
    () => {
      config = JSON.parse(JSON.stringify(DEFAULTS));
      saveConfig();
      buildShowreelList();
      buildProjectsList();
      showToast('Reset to defaults');
    }
  );
});

/* ─────────────────────────────────────────────────────
   CONFIRM DIALOG
───────────────────────────────────────────────────── */
let confirmCallback = null;

function showConfirm(title, message, onConfirm) {
  confirmCallback = onConfirm;
  let dlg = document.getElementById('dbConfirmDlg');
  if (!dlg) {
    dlg = document.createElement('div');
    dlg.className = 'db-confirm';
    dlg.id = 'dbConfirmDlg';
    dlg.innerHTML = `
      <div class="db-confirm-box">
        <h4 id="dbConfirmTitle"></h4>
        <p  id="dbConfirmMsg"></p>
        <div class="db-confirm-actions">
          <button class="db-btn db-btn-secondary" id="dbConfirmNo">Cancel</button>
          <button class="db-btn db-btn-danger" id="dbConfirmYes">Reset</button>
        </div>
      </div>`;
    document.body.appendChild(dlg);
    document.getElementById('dbConfirmNo').addEventListener('click', () => dlg.classList.remove('visible'));
    document.getElementById('dbConfirmYes').addEventListener('click', () => {
      dlg.classList.remove('visible');
      if (confirmCallback) confirmCallback();
    });
  }
  document.getElementById('dbConfirmTitle').textContent = title;
  document.getElementById('dbConfirmMsg').textContent   = message;
  dlg.classList.add('visible');
}

/* ─────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────── */
function escHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ─────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────── */
buildShowreelList();
buildProjectsList();
