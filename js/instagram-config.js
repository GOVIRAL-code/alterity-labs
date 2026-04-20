/* ══════════════════════════════════════════════════════
   Alterity Labs — Instagram Config
   ─────────────────────────────────────────────────────
   HOW TO GET YOUR INSTAGRAM POST/REEL LINK:
   1. Open Instagram on desktop or mobile
   2. Open the post or reel you want
   3. Click the "..." (three dots) menu
   4. Click "Copy link"  →  it looks like:
        https://www.instagram.com/p/ABC123xyz/       (post)
        https://www.instagram.com/reel/ABC123xyz/    (reel)
   5. Paste it below in the matching slot
══════════════════════════════════════════════════════ */

const INSTAGRAM_CONFIG = {

  /* ── SHOWREEL PLAYER ─────────────────────────────────
     The big player at the top.
     Add up to 5 of your best posts/reels.
     The FIRST one loads automatically.
     Clicking the rows below switches to that video.
  ─────────────────────────────────────────────────────*/
  showreelPosts: [
    {
      url:   'https://www.instagram.com/reel/PASTE_REEL_1_HERE/',
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
     Each card's "View Project" button opens this post
     in a popup modal on the same page.
  ─────────────────────────────────────────────────────*/
  projects: [
    { id: 'card-1', postUrl: 'https://www.instagram.com/reel/PASTE_CARD_1_URL_HERE/' },
    { id: 'card-2', postUrl: 'https://www.instagram.com/reel/PASTE_CARD_2_URL_HERE/' },
    { id: 'card-3', postUrl: 'https://www.instagram.com/p/PASTE_CARD_3_URL_HERE/'   },
    { id: 'card-4', postUrl: 'https://www.instagram.com/p/PASTE_CARD_4_URL_HERE/'   },
    { id: 'card-5', postUrl: 'https://www.instagram.com/reel/PASTE_CARD_5_URL_HERE/' },
    { id: 'card-6', postUrl: 'https://www.instagram.com/p/PASTE_CARD_6_URL_HERE/'   },
  ],

  /* ── PROFILE ─────────────────────────────────────────*/
  profileUrl: 'https://www.instagram.com/portfolio.showcase/',
};
