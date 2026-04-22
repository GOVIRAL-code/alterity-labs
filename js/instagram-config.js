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
══════════════════════════════════════════════════════ */

const INSTAGRAM_CONFIG = {

  /* ── SHOWREEL PLAYER ─────────────────────────────────
     Paste YouTube OR Instagram links — both work.
     The FIRST real URL auto-loads in the player.
     Clicking each row on the right switches to that video.
  ─────────────────────────────────────────────────────*/
  showreelPosts: [
    {
      url:   'https://www.instagram.com/p/Cwkc0yTIPjw/',
      label: 'Video Editing — Reels, Shorts, YouTube & Ads',
      tag:   '01',
      time:  '00:00',
    },
    {
      url:   'https://www.instagram.com/reel/PASTE_REEL_2_HERE/',
      label: 'Creative Support — Design, Branding & Content Writing',
      tag:   '02',
      time:  '00:06',
    },
    {
      url:   'https://www.instagram.com/reel/PASTE_REEL_3_HERE/',
      label: 'Digital Development — Websites & Web Applications',
      tag:   '03',
      time:  '00:12',
    },
    {
      url:   'https://www.instagram.com/reel/PASTE_REEL_4_HERE/',
      label: 'Mobile Solutions — Apps for iOS & Android',
      tag:   '04',
      time:  '00:18',
    },
    {
      url:   'https://www.instagram.com/reel/PASTE_REEL_5_HERE/',
      label: 'Results — Brands That Engage, Grow & Scale Online',
      tag:   '05',
      time:  '00:24',
    },
  ],

  /* ── WORK CARDS ──────────────────────────────────────
     postUrl    → opens in popup modal when "View Project" clicked
     previewUrl → plays silently as the card background video
     Both YouTube and Instagram URLs supported in both fields.
  ─────────────────────────────────────────────────────*/
  projects: [
    {
      id:         'card-1',
      postUrl:    'https://www.instagram.com/reel/PASTE_CARD_1_URL_HERE/',
      previewUrl: 'https://www.instagram.com/reel/PASTE_CARD_1_URL_HERE/',
    },
    {
      id:         'card-2',
      postUrl:    'https://www.instagram.com/reel/PASTE_CARD_2_URL_HERE/',
      previewUrl: 'https://www.instagram.com/reel/PASTE_CARD_2_URL_HERE/',
    },
    {
      id:         'card-3',
      postUrl:    'https://www.instagram.com/p/PASTE_CARD_3_URL_HERE/',
      previewUrl: 'https://www.instagram.com/p/PASTE_CARD_3_URL_HERE/',
    },
    {
      id:         'card-4',
      postUrl:    'https://www.instagram.com/p/PASTE_CARD_4_URL_HERE/',
      previewUrl: 'https://www.instagram.com/p/PASTE_CARD_4_URL_HERE/',
    },
    {
      id:         'card-5',
      postUrl:    'https://www.instagram.com/reel/PASTE_CARD_5_URL_HERE/',
      previewUrl: 'https://www.instagram.com/reel/PASTE_CARD_5_URL_HERE/',
    },
    {
      id:         'card-6',
      postUrl:    'https://www.instagram.com/p/PASTE_CARD_6_URL_HERE/',
      previewUrl: 'https://www.instagram.com/p/PASTE_CARD_6_URL_HERE/',
    },
  ],

  /* ── PROFILE ─────────────────────────────────────────*/
  profileUrl: 'https://www.instagram.com/portfolio.showcase/',
};
