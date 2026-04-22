/* ══════════════════════════════════════════════════════
   Alterity Labs — Video Config
   ─────────────────────────────────────────────────────
   SUPPORTED URL FORMATS:
   ✅ YouTube:   https://youtu.be/VIDEO_ID
                 https://www.youtube.com/watch?v=VIDEO_ID
                 https://www.youtube.com/shorts/VIDEO_ID
   ✅ Instagram: https://www.instagram.com/reel/POST_ID/
                 https://www.instagram.com/p/POST_ID/

   HOW TO GET THE LINK:
   • YouTube  → Share button → Copy Link
   • Instagram → "..." menu → Copy Link

   DASHBOARD:
   Open dashboard.html in your browser to manage all
   video URLs visually — no code editing needed.
   Changes are saved in your browser and loaded here.
══════════════════════════════════════════════════════ */

/* ── FALLBACK DEFAULTS ─────────────────────────────────
   These are used only if the dashboard has never been
   saved. Once you save in the dashboard, those values
   are used instead.
─────────────────────────────────────────────────────*/
const _DEFAULTS = {

  showreelPosts: [
    {
      url:   'https://www.instagram.com/p/Cwkc0yTIPjw/',
      label: 'Video Editing — Reels, Shorts, YouTube & Ads',
      tag:   '01',
      time:  '00:00',
    },
    {
      url:   '',
      label: 'Creative Support — Design, Branding & Content Writing',
      tag:   '02',
      time:  '00:06',
    },
    {
      url:   '',
      label: 'Digital Development — Websites & Web Applications',
      tag:   '03',
      time:  '00:12',
    },
    {
      url:   '',
      label: 'Mobile Solutions — Apps for iOS & Android',
      tag:   '04',
      time:  '00:18',
    },
    {
      url:   '',
      label: 'Results — Brands That Engage, Grow & Scale Online',
      tag:   '05',
      time:  '00:24',
    },
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

/* ── LOAD FROM DASHBOARD (localStorage) ───────────────
   The dashboard saves to 'alterity_video_config'.
   We merge that with the defaults so fields always exist.
─────────────────────────────────────────────────────*/
(function buildConfig() {
  let saved = null;
  try {
    const raw = localStorage.getItem('alterity_video_config');
    if (raw) saved = JSON.parse(raw);
  } catch (e) { /* localStorage unavailable — use defaults */ }

  if (!saved) {
    window.INSTAGRAM_CONFIG = _DEFAULTS;
    return;
  }

  /* Deep merge saved data over defaults */
  const cfg = JSON.parse(JSON.stringify(_DEFAULTS));

  if (saved.showreelPosts && Array.isArray(saved.showreelPosts)) {
    saved.showreelPosts.forEach(function(post, i) {
      if (i < cfg.showreelPosts.length) {
        if (post.url   !== undefined) cfg.showreelPosts[i].url   = post.url;
        if (post.label !== undefined) cfg.showreelPosts[i].label = post.label;
        if (post.time  !== undefined) cfg.showreelPosts[i].time  = post.time;
        if (post.tag   !== undefined) cfg.showreelPosts[i].tag   = post.tag;
      }
    });
  }

  if (saved.projects && Array.isArray(saved.projects)) {
    saved.projects.forEach(function(proj, i) {
      if (i < cfg.projects.length) {
        if (proj.postUrl    !== undefined) cfg.projects[i].postUrl    = proj.postUrl;
        if (proj.previewUrl !== undefined) cfg.projects[i].previewUrl = proj.previewUrl;
      }
    });
  }

  if (saved.profileUrl) cfg.profileUrl = saved.profileUrl;

  window.INSTAGRAM_CONFIG = cfg;
})();
