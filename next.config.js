import filterWebpackStats from "@bundle-stats/plugin-webpack-filter";
import pwa from "@ducanh2912/next-pwa";
import bundleAnalyzer from "@next/bundle-analyzer";
import { StatsWriterPlugin } from "webpack-stats-plugin";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const withPWA = pwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [
    /middleware-manifest\.json$/,
    /\.map$/,
    /react-loadable-manifest\.json$/,
  ],
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

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "@fluentui/react-components",
      "@fluentui/react-icons",
      "lodash",
      "node-emoji",
      "grapheme-splitter",
      "dompurify",
      "chroma-js",
      "@tiptap/extension-link",
      "@tiptap/extension-placeholder",
      "@tiptap/extension-underline",
      "@tiptap/pm",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },
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

    // Enhanced tree shaking and optimization
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        minimize: true,
      };
    }

    // Remove problematic React aliases that conflict with Next.js resolution
    // Next.js handles React resolution automatically

    // Exclude mocks from production bundle (simplified approach)
    if (!dev) {
      // Only exclude specific test utilities, not core dependencies
      config.externals = config.externals || [];
      // Remove MSW externals as they might interfere with normal dependencies
    }

    if (!dev && !isServer) {
      config.plugins.push(
        new StatsWriterPlugin({
          filename: "../.next/analyze/webpack-stats.json",
          stats: {
            preset: "detailed",
            assets: true,
            chunks: true,
            modules: true,
            excludeAssets: [/webpack-stats.json/, /\.map$/],
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

export default withBundleAnalyzer(withPWA(nextConfig));
