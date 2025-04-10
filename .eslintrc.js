module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: "./tsconfig.json",
  },
  env: { browser: true, node: true, es2022: true },
  plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "next/core-web-vitals",
  ],
  settings: {
    react: { version: "detect" },
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
    curly: "warn",
    "prefer-const": "warn",
    "no-return-await": "warn",
    "no-unused-expressions": "error",
    "no-implicit-coercion": "warn",
    "no-restricted-imports": [
      "error",
      {
        patterns: ["node_modules/*"],
      },
    ],
    // React
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-useless-fragment": "warn",
    "react/no-danger": "warn",
    "react/self-closing-comp": "warn",
    "react/jsx-fragments": ["error"],
    "react-hooks/exhaustive-deps": "warn",
    "react/no-deprecated": "warn",

    // TypeScript
    "@typescript-eslint/explicit-module-boundary-types": "off",
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

    // Import Resolution
    "import/newline-after-import": [
      "warn",
      { exactCount: true, considerComments: true },
    ],
    "import/order": [
      "warn",
      {
        groups: ["external", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "@fluentui/**",
            group: "external",
            position: "before",
          },
          {
            pattern: "@griffel/react/**",
            group: "external",
            position: "before",
          },
          {
            pattern: "@/**",
            group: "internal",
            position: "after",
          },
          {
            pattern: "./**",
            group: "internal",
            position: "after",
          },
          {
            pattern: "../**",
            group: "internal",
            position: "after",
          },
        ],
        distinctGroup: false,
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/no-unresolved": [
      "error",
      {
        commonjs: true,
        amd: true,
        caseSensitive: true,
      },
    ],
  },
  overrides: [
    {
      files: [".eslintrc.js", "*.config.js"],
      parser: "espree",
      parserOptions: { ecmaVersion: 2022, sourceType: "module", project: null },
    },
  ],
};
