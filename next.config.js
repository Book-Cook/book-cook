import filterWebpackStats from "@bundle-stats/plugin-webpack-filter";
import bundleAnalyzer from "@next/bundle-analyzer";
import pwa from "@ducanh2912/next-pwa";
import { StatsWriterPlugin } from "webpack-stats-plugin";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enablePWA = process.env.DISABLE_PWA !== "true";

const withPWA = enablePWA
  ? pwa({
      dest: "public",
      disable: process.env.NODE_ENV === "development",
      register: true,
      skipWaiting: true,
      // `/` is statically prerendered and returns identical HTML to everyone,
      // so the start URL can be precached with the rest of the build output.
      // Leaving this on made next-pwa patch history.replaceState and re-fetch
      // the whole document during hydration purely to seed its start-url cache.
      dynamicStartUrl: false,
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
  serverExternalPackages: ["@tanstack/query-core"],
  // Bundle (rather than externalize) this ESM-only package on the server.
  // Externalizing it made every importer an async webpack module, which loses
  // next/router's RouterContext during static prerendering. Its CJS entry is a
  // 4.9 MB all-icons monolith, so requiring it is not an option either.
  transpilePackages: ["@phosphor-icons/react"],
  experimental: {
    reactCompiler: {
      target: "19",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "www.tasteofhome.com" },
      { protocol: "https", hostname: "beyondfrosting.com" },
      { protocol: "https", hostname: "therecipecritic.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Cloudflare R2 public bucket (recipe cover photos)
      { protocol: "https", hostname: "pub-*.r2.dev" },
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
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-tooltip",
        // Each of these is ESM-first and turned its importers (AppShell,
        // AppSidebar, RecipeSearchFlyout, ...) into async webpack modules,
        // which lost RouterContext during static prerendering. All ship a CJS
        // main and no "type": "module", so requiring them synchronously is safe.
        // @phosphor-icons/react is deliberately excluded: it sets
        // "type": "module" while its CJS entry is a .js file, so require() of it
        // throws "exports is not defined in ES module scope".
        "@radix-ui/react-select",
        "@radix-ui/react-accordion",
        "cmdk",
        "embla-carousel-react",
        "@dnd-kit/core",
        "@dnd-kit/sortable",
        "@dnd-kit/modifiers",
        "next-auth/react",
      ];
      const isForcedCommonJs = (request) => {
        if (FORCE_COMMONJS.includes(request)) {
          return true;
        }
        // The Lexical family is ESM-only and made the whole editor subtree async
        // webpack modules on the server, which lost next/router's RouterContext
        // during static prerendering. Every package ships a CJS entry.
        // @lexical/code is excluded so the PrismJS-stripping alias below still
        // applies -- externalizing it would pull PrismJS back into the build.
        if (request === "@lexical/code" || request.startsWith("@lexical/code/")) {
          return false;
        }
        return (
          request === "lexical" ||
          request.startsWith("@lexical/") ||
          // package.json sets "type": "module", so webpack resolved Next's ESM
          // build (next/dist/esm/**) for app code while the Pages Router
          // renderer uses the CJS build. That duplicated
          // router-context.shared-runtime, so every useRouter() call in the app
          // tree read a different context instance than the renderer provided
          // and threw "NextRouter was not mounted" during static prerendering.
          /^next\/(router|document|link|head|image|script|dynamic)$/.test(
            request,
          )
        );
      };

      const existingExternals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
          ? [config.externals]
          : [];
      config.externals = [
        ({ request }, callback) => {
          if (request && isForcedCommonJs(request)) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
        ...existingExternals,
      ];
    }

    // Alias @lexical/code to a stub so PrismJS is not bundled.
    // @lexical/markdown imports @lexical/code for its CODE transformer, but
    // the app only uses HEADING, QUOTE, list and text-format transformers.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@lexical/code": path.resolve(
        __dirname,
        "src/stubs/lexical-code-stub.js",
      ),
    };

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
        }),
      );
    }
    return config;
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));
