import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  coverageProvider: "v8",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!jest.config.js",
    "!next.config.{js,cjs,mjs}",
    "!**/*.test.{js,jsx,ts,tsx}",
    "!**/__tests__/**",
    "!**/__mocks__/**",
    "!eslint.config.js",
    "!jest.setup.ts",
  ],
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
    "^msw$": "<rootDir>/node_modules/msw/lib/core/index.js",
  },
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "<rootDir>/tests/"],
};

const nextJestConfig = createJestConfig(customJestConfig);

// Override transformIgnorePatterns after next/jest merges to prevent
// next/jest's own pattern from blocking MSW's ESM transitive dependencies.
export default async () => {
  const config = await nextJestConfig();
  config.transformIgnorePatterns = [
    // Transform all node_modules except CSS modules and the few packages
    // that ship valid CJS (geist is required by next/jest).
    "^.+\\.module\\.(css|sass|scss)$",
    "/node_modules/(?!(geist|string-width|strip-ansi|ansi-regex|wrap-ansi|jose|bson|mongodb|node-mocks-http|@mswjs|until-async)/)",
  ];
  return config;
};
