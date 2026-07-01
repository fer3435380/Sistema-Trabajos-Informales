const APP_VERSION = 'nexojobs-pwa-v1'
const SHELL_CACHE = `${APP_VERSION}-shell`
const STATIC_CACHE = `${APP_VERSION}-static`
const API_CACHE = `${APP_VERSION}-api`

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons.svg',
]

const API_CACHE_PATHS = [
  '/api/v1/worker/dashboard/',
  '/api/v1/company/dashboard/',
  '/api/v1/jobs/',
  '/api/v1/courses/',
  '/api/v1/applications/mine/',
  '/api/v1/applications/received/',
  '/api/v1/notifications/',
]

function isNavigationRequest(request) {
  return request.mode === 'navigate'
}

function isStaticAsset(request) {
  return ['style', 'script', 'worker', 'image', 'font'].includes(request.destination)
}

function isCacheableApiGet(request) {
  if (request.method !== 'GET') return false

  const url = new URL(request.url)
  return API_CACHE_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(path))
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  if (cachedResponse) return cachedResponse

  const networkResponse = await fetch(request)
  if (networkResponse.ok || networkResponse.type === 'opaque') {
    cache.put(request, networkResponse.clone())
  }
  return networkResponse
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok || networkResponse.type === 'opaque') {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) return cachedResponse
    throw error
  }
}

async function navigationFallback(request) {
  try {
    const networkResponse = await fetch(request)
    const shellCache = await caches.open(SHELL_CACHE)
    shellCache.put('/index.html', networkResponse.clone())
    return networkResponse
  } catch {
    const shellCache = await caches.open(SHELL_CACHE)
    return (await shellCache.match('/index.html')) || Response.error()
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => !cacheName.startsWith(APP_VERSION))
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  if (isNavigationRequest(request)) {
    event.respondWith(navigationFallback(request))
    return
  }

  if (isCacheableApiGet(request)) {
    event.respondWith(networkFirst(request, API_CACHE))
    return
  }

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request))
  }
})
