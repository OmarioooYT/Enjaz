/**
 * Enjaz — Service worker: offline app shell, cached CDN libraries and notification
 * clicks.
 *
 * Copyright (C) 2026 Omariooo
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Enjaz, free software released under the GNU General
 * Public License v3.0 or later. See the LICENSE file for details.
 */

// Enjaz service worker: offline app shell + notification clicks.
// Bump CACHE_VERSION when the list of shell files changes.
const CACHE_VERSION = 'enjaz-v2';
const APP_SHELL = [
  'enjaz.html',
  'index.html',
  'manifest.webmanifest',
  'css/base.css',
  'css/animations.css',
  'css/components.css',
  'css/home.css',
  'js/state.js',
  'js/i18n.js',
  'js/ui.js',
  'js/auth.js',
  'js/data.js',
  'js/render.js',
  'js/projects-tasks.js',
  'js/ai-assistant.js',
  'js/features.js',
  'js/app.js',
  'js/home.js',
  'js/tailwind-config.js',
  'assets/logo.png',
  'assets/brand-logo.png',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

// Third-party libraries and fonts the page loads; cached so the app opens offline.
const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  'js.puter.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Own files: network first (always fresh online), cache when offline.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // CDN libraries/fonts: serve from cache, refresh in the background.
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(cache =>
        cache.match(req).then(cached => {
          const network = fetch(req)
            .then(res => {
              if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
  // Everything else (Supabase API, AI requests) goes straight to the network.
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || 'enjaz.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
