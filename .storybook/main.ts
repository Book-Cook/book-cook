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
    // Pass Chromatic detection to stories
    CHROMATIC_PROJECT_TOKEN: process.env.CHROMATIC_PROJECT_TOKEN,
  }),
  // Add webpack configuration for better compatibility
  "webpackFinal": async (config) => {
    // Ensure proper handling of ES modules and polyfills
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "fs": false,
      "path": false,
      "crypto": false,
    };
    
    return config;
  }
};
export default config;