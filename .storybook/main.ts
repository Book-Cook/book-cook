import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "msw-storybook-addon"
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  // Add environment-specific configuration
  "env": (config) => ({
    ...config,
    // Ensure MSW worker is available in all environments
    STORYBOOK_ENV: process.env.NODE_ENV || 'development',
  }),
  "webpackFinal": async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "fs": false,
      "path": false,
      "crypto": false,
    };
    
    // Optimize build performance
    config.cache = {
      type: 'filesystem',
    };
    
    return config;
  }
};
export default config;