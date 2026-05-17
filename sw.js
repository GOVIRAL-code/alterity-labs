// Service Worker for Alterity Labs Portfolio
// Caches static assets for faster repeat visits

const CACHE_NAME = 'alterity-labs-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/css/styles.css',
  '/css/dashboard.css',
  '/js/script.js',
  '/js/instagram-config.js',
  '/js/dashboard.js',
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