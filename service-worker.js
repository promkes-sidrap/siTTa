const CACHE_NAME = 'imunisasi-tt-cache-v2';
const urlsToCache = [
  '/', // Ini penting untuk meng-cache root URL
  '/index.html',
  '/manifest.json',
  '/service-worker.js', // Cache service worker itu sendiri
  // Aset CSS dan JS eksternal yang digunakan
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  // Jika Anda memiliki file JS atau CSS lokal, tambahkan di sini:
  // '/js/app.js', // Contoh
  // '/css/style.css', // Contoh
  // Aset ikon
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // Tambahkan semua aset penting lainnya (misalnya gambar, font lokal) di sini
];

// Event 'install': Meng-cache aset saat Service Worker pertama kali diinstal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': Mencegat permintaan jaringan dan menyajikannya dari cache jika tersedia
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, sajikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari jaringan
        return fetch(event.request).catch(() => {
            // Ini untuk menangani kasus offline dan aset tidak di-cache
            // Anda bisa mengembalikan halaman offline khusus di sini jika mau
            // Misalnya: caches.match('/offline.html');
        });
      })
  );
});

// Event 'activate': Membersihkan cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Hapus cache yang tidak ada dalam whitelist
          }
        })
      );
    })
  );
});

