import filterWebpackStats from "@bundle-stats/plugin-webpack-filter";
import bundleAnalyzer from "@next/bundle-analyzer";
import pwa from "@ducanh2912/next-pwa";
import { StatsWriterPlugin } from "webpack-stats-plugin";
const enablePWA = process.env.DISABLE_PWA !== "true";

const withPWA = enablePWA
  ? pwa({
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
    })
  : (config) => config;

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@phosphor-icons/react", "@tanstack/react-query", "@tanstack/query-core"],
  experimental: {
    reactCompiler: {
      target: "18",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.tasteofhome.com" },
      { protocol: "https", hostname: "beyondfrosting.com" },
      { protocol: "https", hostname: "therecipecritic.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  webpack: (config, options) => {
    const { dev, isServer } = options;

    if (isServer) {
      // Force synchronous CJS externalization for ESM packages that otherwise become
      // async webpack modules, breaking SSR pre-rendering in Pages Router.
      const FORCE_COMMONJS = [
        "@tanstack/react-query",
        "@tanstack/query-core",
        "clsx",
        "sonner",
        "dompurify",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-tooltip",
      ];
      const existingExternals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
          ? [config.externals]
          : [];
      config.externals = [
        ({ request }, callback) => {
          if (FORCE_COMMONJS.includes(request)) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
        ...existingExternals,
      ];
    }

    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        minimize: true,
      };
    }

    if (!dev && !isServer && process.env.ANALYZE === "true") {
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
