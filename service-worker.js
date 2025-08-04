const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Event: install
// Menginstal service worker dan meng-cache semua file yang dibutuhkan.
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: All files cached successfully.');
        // Memaksa service worker baru untuk segera aktif
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache files.', error);
      })
  );
});

// Event: activate
// Mengaktifkan service worker dan membersihkan cache lama.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete.');
      // Memaksa klien untuk menggunakan service worker yang baru
      return self.clients.claim();
    })
  );
});

// Event: fetch
// Menyajikan file dari cache jika tersedia, atau dari jaringan jika tidak.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, sajikan dari cache
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        // Jika tidak ada di cache, ambil dari jaringan
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .catch(error => {
            console.error('Service Worker: Fetching failed.', error);
            // Anda bisa menyajikan halaman offline di sini jika diperlukan
          });
      })
  );
});


