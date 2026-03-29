import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import { configs, config } from "typescript-eslint";

export default config(
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "dist/",
      "coverage/",
      "lcov-report/",
      "next-env.d.ts",
      ".env",
      ".env.*",
      "!.env.example",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      ".eslintcache",
      "*.log",
      "logs/",
    ],
  },

  eslint.configs.recommended,

  configs.recommendedTypeChecked,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Clean the browser globals before spreading
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key, value]) => [
            key.trim(),
            value,
          ])
        ),
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-useless-fragment": "warn",
      "react/no-danger": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-fragments": ["error"],
      "react-hooks/exhaustive-deps": "warn",
      "react/no-deprecated": "warn",
    },
  },

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          paths: ["src"],
        },
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json"],
        },
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
    rules: {
      ...importPlugin.configs.errors.rules,
      ...importPlugin.configs.warnings.rules,
      ...importPlugin.configs.typescript.rules,
      "import/newline-after-import": [
        "warn",
        { exactCount: true, considerComments: true },
      ],
      "import/no-duplicates": "warn",
      "import/no-useless-path-segments": "warn",
      "import/order": [
        "warn",
        {
          groups: ["external", "internal"],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "@fluentui/**", group: "external", position: "before" },
            {
              pattern: "@griffel/react/**",
              group: "external",
              position: "before",
            },
            { pattern: "@/**", group: "internal", position: "after" },
            { pattern: "./**", group: "internal", position: "after" },
            { pattern: "../**", group: "internal", position: "after" },
          ],
          distinctGroup: false,
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-unresolved": [
        "error",
        { commonjs: true, amd: true, caseSensitive: true, ignore: ["^@/"] },
      ],
    },
  },

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      curly: "warn",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-debugger": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-return-await": "warn",
      "prefer-template": "warn",
      "object-shorthand": "warn",
      "no-unused-expressions": "error",
      "no-implicit-coercion": "warn",
      "no-restricted-imports": ["error", { patterns: ["node_modules/*"] }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true,
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },

  {
    files: ["eslint.config.js", "*.config.{js,cjs,mjs}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      parser: undefined,
      parserOptions: {
        project: null,
        ecmaFeatures: { jsx: false },
      },
    },
    rules: {
      ...configs.disableTypeChecked.rules,
    },
  }
);
