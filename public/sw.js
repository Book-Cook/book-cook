if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + ".js", n).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, c) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let t = {};
    const r = (e) => a(e, i),
      o = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (c(...e), t));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/05286222-408e0e125f9a57b2.js",
          revision: "408e0e125f9a57b2",
        },
        {
          url: "/_next/static/chunks/0619bbfe-8fb59419d3875fd7.js",
          revision: "8fb59419d3875fd7",
        },
        {
          url: "/_next/static/chunks/157-8b9453234bf79c01.js",
          revision: "8b9453234bf79c01",
        },
        {
          url: "/_next/static/chunks/43147d3e-6b43376d44e856ff.js",
          revision: "6b43376d44e856ff",
        },
        {
          url: "/_next/static/chunks/520c8229-26e3efa7c07cdf56.js",
          revision: "26e3efa7c07cdf56",
        },
        {
          url: "/_next/static/chunks/702-37542daf0e7a3199.js",
          revision: "37542daf0e7a3199",
        },
        {
          url: "/_next/static/chunks/741e038c-e7fa34b13f33cdc7.js",
          revision: "e7fa34b13f33cdc7",
        },
        {
          url: "/_next/static/chunks/7fab36dd-8209939b098cd3b6.js",
          revision: "8209939b098cd3b6",
        },
        {
          url: "/_next/static/chunks/899-657f3dd8dc1da0fc.js",
          revision: "657f3dd8dc1da0fc",
        },
        {
          url: "/_next/static/chunks/9ff28164-1aa4fb69ac3fd3c6.js",
          revision: "1aa4fb69ac3fd3c6",
        },
        {
          url: "/_next/static/chunks/fc83e031-93e4f97c8020f5c2.js",
          revision: "93e4f97c8020f5c2",
        },
        {
          url: "/_next/static/chunks/fd0b3a01-afde92f939d5d8b6.js",
          revision: "afde92f939d5d8b6",
        },
        {
          url: "/_next/static/chunks/framework-64ad27b21261a9ce.js",
          revision: "64ad27b21261a9ce",
        },
        {
          url: "/_next/static/chunks/main-9ce74d280855ab44.js",
          revision: "9ce74d280855ab44",
        },
        {
          url: "/_next/static/chunks/pages/_app-f3d793163814a966.js",
          revision: "f3d793163814a966",
        },
        {
          url: "/_next/static/chunks/pages/_error-7a92967bea80186d.js",
          revision: "7a92967bea80186d",
        },
        {
          url: "/_next/static/chunks/pages/collections-28c6528cdf4ee803.js",
          revision: "28c6528cdf4ee803",
        },
        {
          url: "/_next/static/chunks/pages/index-5962b170be85a8c9.js",
          revision: "5962b170be85a8c9",
        },
        {
          url: "/_next/static/chunks/pages/newRecipe-57ba26b4517e1faf.js",
          revision: "57ba26b4517e1faf",
        },
        {
          url: "/_next/static/chunks/pages/recipes-2d93544f55837185.js",
          revision: "2d93544f55837185",
        },
        {
          url: "/_next/static/chunks/pages/recipes/%5Brecipes%5D-662450dce0bc5f66.js",
          revision: "662450dce0bc5f66",
        },
        {
          url: "/_next/static/chunks/pages/settings-9fceb7d1743a011e.js",
          revision: "9fceb7d1743a011e",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-2d6c20b89449f43d.js",
          revision: "2d6c20b89449f43d",
        },
        {
          url: "/_next/static/xIzOLuAG_rnvJAV8-orxN/_buildManifest.js",
          revision: "a27c6c9e77129a3d49a7ae79c5416c0a",
        },
        {
          url: "/_next/static/xIzOLuAG_rnvJAV8-orxN/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/icons/apple-touch-icon.png",
          revision: "9af96bf4309ff80d05d247e6929f0282",
        },
        {
          url: "/icons/favicon-96x96.png",
          revision: "5700784d94a8c9a98c2ceeecddd51e80",
        },
        {
          url: "/icons/favicon.ico",
          revision: "a7d24da20a28917df7dd06d7babdca6b",
        },
        {
          url: "/icons/favicon.svg",
          revision: "36f13f6629ae5ab8576f36d80c30029c",
        },
        {
          url: "/icons/web-app-manifest-192x192.png",
          revision: "caa233bab86720597d0ac9a0901356d9",
        },
        {
          url: "/icons/web-app-manifest-512x512.png",
          revision: "6c93ca96bee35922ef04a86697b11ec9",
        },
        {
          url: "/image/Book-Cook-Logo.svg",
          revision: "2da9fd591b83c01acc66463e7928dc94",
        },
        {
          url: "/manifest.webmanifest",
          revision: "5ae4777e098807c3a82546bbe51d4acb",
        },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        a &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        "1" === e.headers.get("RSC") && a && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
