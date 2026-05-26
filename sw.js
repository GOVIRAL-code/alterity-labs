// Service Worker for Alterity Labs Portfolio
// Caches static assets for faster repeat visits
// Includes all animation-related assets (CSS, JS) for smooth performance

const CACHE_NAME = 'alterity-labs-portfolio-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/css/styles.css',          // Contains all CSS animations
  '/css/dashboard.css',       // Dashboard CSS animations
  '/js/script.js',            // Main JS including animations
  '/js/instagram-config.js',  // Video configuration
  '/js/dashboard.js',         // Dashboard logic and animations
  // Add any other static assets here
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if found
        if (response) {
          return response;
        }
        // Otherwise, fetch from network
        return fetch(event.request);
      })
  );
});