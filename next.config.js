const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  // Better caching strategy
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-font-assets",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-image-assets",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tasteofhome.com",
      },
      {
        protocol: "https",
        hostname: "beyondfrosting.com",
      },
      {
        protocol: "https",
        hostname: "therecipecritic.com",
      },
    ],
  },

  webpack: (config, options) => {
    const { dev, isServer } = options;

    if (!dev && !isServer) {
      const { StatsWriterPlugin } = require("webpack-stats-plugin");
      const filterWebpackStats = require("@bundle-stats/plugin-webpack-filter");

      config.plugins.push(
        new StatsWriterPlugin({
          filename: "../.next/analyze/webpack-stats.json",
          stats: {
            assets: true,
            chunks: true,
            modules: true,
            excludeAssets: [/webpack-stats.json/],
            excludeModules: [/custom-module.js/],
          },
          transform: (webpackStats) => {
            const filteredSource = filterWebpackStats(webpackStats);
            return JSON.stringify(filteredSource);
          },
        })
      );
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));
