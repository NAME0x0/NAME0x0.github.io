// Service Worker for NAME0x0 Portfolio
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `name0x0-portfolio-${CACHE_VERSION}`;
const RUNTIME_CACHE = 'name0x0-runtime';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style-optimized.css',
  '/app-optimized.js',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('name0x0-') && cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Handle API requests differently
  if (url.pathname.startsWith('/api/') || url.hostname !== location.hostname) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // For navigation requests, try network first
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // For everything else, use cache first
  event.respondWith(cacheFirst(event.request));
});

// Cache strategies
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    });
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Background sync for widget updates
self.addEventListener('sync', event => {
  if (event.tag === 'update-widgets') {
    event.waitUntil(updateWidgets());
  }
});

async function updateWidgets() {
  const cache = await caches.open(RUNTIME_CACHE);
  
  // Fetch fresh data for widgets
  const widgetEndpoints = [
    'https://api.openweathermap.org/data/2.5/weather?q=Dubai&appid=YOUR_API_KEY',
    'https://api.zenquotes.io/api/today',
    'https://random-word-api.herokuapp.com/word'
  ];
  
  await Promise.all(
    widgetEndpoints.map(async endpoint => {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          await cache.put(endpoint, response);
        }
      } catch (error) {
        console.error('Failed to update widget:', endpoint, error);
      }
    })
  );
}

// Push notifications (future feature)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('NAME0x0 Portfolio', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Periodic background sync for daily updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'daily-update') {
    event.waitUntil(performDailyUpdate());
  }
});

async function performDailyUpdate() {
  // Update cached data at midnight
  await updateWidgets();
  
  // Clean up old runtime cache entries
  const cache = await caches.open(RUNTIME_CACHE);
  const requests = await cache.keys();
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  await Promise.all(
    requests.map(async request => {
      const response = await cache.match(request);
      const dateHeader = response.headers.get('date');
      if (dateHeader) {
        const responseDate = new Date(dateHeader).getTime();
        if (now - responseDate > maxAge) {
          await cache.delete(request);
        }
      }
    })
  );
}