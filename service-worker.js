// Service worker for the Stellar Evolution PWA

const CACHE_NAME = 'stellar-evolution-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles/main.css',
  './styles/animations.css',
  './scripts/app.js',
  './scripts/context/GameContext.js',
  './scripts/context/AudioContext.js',
  './scripts/components/Game.js',
  './scripts/components/Terminal.js',
  './scripts/components/CommandInput.js',
  './scripts/components/StatusBar.js',
  './scripts/components/Header.js',
  './scripts/components/LoadingScreen.js',
  './scripts/components/ImageModal.js',
  './scripts/components/Message.js',
  './scripts/components/TutorialHint.js',
  './scripts/core/gameState.js',
  './scripts/core/commandProcessor.js',
  './scripts/core/resourceSystem.js',
  './scripts/utilities/api.js',
  './scripts/utilities/storage.js',
  './scripts/utilities/helpers.js',
  './scripts/utilities/speechSynthesis.js',
  './scripts/utilities/serviceWorker.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if response is not valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be used once
            const responseToCache = response.clone();
            
            // Add to cache for future requests
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

