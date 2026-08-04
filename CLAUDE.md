## 🛠️ Development Environment

- **Language**: TypeScript (`^5.8.3`)
- **Framework**: Next.js (Pages Router)
- **Styling**: CSS Modules
- **Component Library**: None
- **Data Fetching**: React Query (TanStack)
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with `@typescript-eslint`
- **Formatting**: Prettier
- **Package Manager**: `yarn` (preferred)

## ⚙️ Dev Commands

- **Dev server**: `yarn dev`
- **Build**: `yarn build`
- **Start**: `yarn start`
- **Lint**: `yarn lint`
- **Test**: `yarn test`
- **Coverage**: `yarn test:coverage`

## 📂 Project Structure

```
.
├── src/
│   ├── pages/              # Next.js Pages Router
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── api/            # API routes
│   │   ├── collections.tsx
│   │   ├── discover.tsx
│   │   ├── meal-plan.tsx
│   │   ├── pantry.tsx
│   │   ├── recipes/
│   │   └── settings.tsx
│   ├── components/         # UI components
│   │   ├── Animation/
│   │   ├── Editor/
│   │   ├── MealPlan/
│   │   ├── RecipeCard/
│   │   ├── RecipePage/
│   │   └── ...
│   ├── clientToServer/     # API client wrappers
│   │   ├── fetch/          # GET requests
│   │   ├── post/           # POST requests
│   │   ├── delete/         # DELETE requests
│   │   └── types/
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React Context providers
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # App constants
│   ├── mocks/              # Mock data for testing
│   ├── server/             # Server-side utilities
│   ├── clients/            # External API clients
│   └── stories/            # Storybook stories
├── tests/                  # Playwright end-to-end specs (ignored by Jest)
├── public/                 # Static assets
│   ├── icons/
│   └── image/
├── lib/                    # Build/config helpers
├── scripts/                # Build and dev scripts
├── .storybook/             # Storybook configuration
├── .husky/                 # Git hooks
├── specs/                  # Specifications
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## 📝 Code Style Standards

- Prefer arrow functions
- Annotate return types
- Always destructure props
- Avoid `any` type, use `unknown` or strict generics
- Group imports: react → next → libraries → local

## 🔍 Documentation & Onboarding

- Each component and hook should include a short comment on usage
- Document top-level files (like `pages/_app.tsx`) and configs
- Keep `README.md` up to date with getting started, design tokens, and component usage notes

## 🧪 Test placement

- Jest specs live in `src/**/__tests__/` or beside their subject as `*.test.ts(x)`.
- **Never put a test file under `src/pages/`.** Every file there becomes a route,
  so `src/pages/api/upload/__tests__/presign.test.ts` shipped as a live
  `/api/upload/__tests__/presign.test` endpoint. API-route specs belong in
  `src/__tests__/api/**`; import the handler by root-absolute path
  (e.g. `src/pages/api/upload/presign`).
- `tests/` holds Playwright specs only — `jest.config.js` ignores it, so a Jest
  file placed there runs silently never.

## 🔐 Security

- Validate all server-side inputs (API routes)
- Use HTTPS-only cookies and CSRF tokens when applicable
- Protect sensitive routes with middleware or session logic
