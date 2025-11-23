// Service Worker vazio para evitar erros
// Este arquivo será desregistrado automaticamente pelo layout

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  self.clients.claim()
})

