// Minimal no-op service worker placeholder.
// This prevents 404s for /service-worker.js in production.
// If you later add real PWA features, replace this file.

self.addEventListener('install', () => {
  // Skip waiting so the SW activates immediately.
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Claim clients so the SW starts controlling pages ASAP.
  self.clients.claim();
});


