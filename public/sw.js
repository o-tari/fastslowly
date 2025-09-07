// Service Worker for FastSlowly PWA
const CACHE_NAME = 'fastslowly-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        return fetch(event.request)
      }
    )
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Sync offline data when back online
    const offlineData = await getOfflineData()
    if (offlineData.length > 0) {
      await syncToServer(offlineData)
      await clearOfflineData()
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

async function getOfflineData() {
  // Get offline data from IndexedDB
  return new Promise((resolve) => {
    const request = indexedDB.open('FastSlowlyDB')
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['logs'], 'readonly')
      const store = transaction.objectStore('logs')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result)
      }
    }
  })
}

async function syncToServer(data) {
  // Send data to server
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Sync failed')
    }
  } catch (error) {
    console.error('Sync to server failed:', error)
    throw error
  }
}

async function clearOfflineData() {
  // Clear synced data from IndexedDB
  return new Promise((resolve) => {
    const request = indexedDB.open('FastSlowlyDB')
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['logs'], 'readwrite')
      const store = transaction.objectStore('logs')
      const clearRequest = store.clear()
      
      clearRequest.onsuccess = () => {
        resolve()
      }
    }
  })
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Fasting reminder',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('FastSlowly', options)
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
