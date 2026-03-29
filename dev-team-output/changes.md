# Changes

## Verification Plan

Run `yarn test --testPathPatterns="RecipeCard"` after applying fixes — all existing RecipeCard tests must pass. Visual confirmation via Playwright screenshots at 390x844 (iPhone 14 viewport) showing:
- Media/image area renders at a proper height (160px) rather than collapsing to ~70px from the vw-based clamp
- Emoji renders at 36px (visible) rather than ~14px
- Carousel title truncates cleanly without pushing arrow controls off-screen
- The "more options" (⋯) button is visible without requiring hover on touch devices

## Implementation

| File | Change | Requirement satisfied |
|------|--------|-----------------------|
| `src/components/RecipeCard/RecipeCard.module.css` | Added `@media (max-width: 480px)` block overriding `.media` to `height: 160px`, `.mediaFallback` to `height: 130px`, `.emoji` to `font-size: 36px` | Fixes vw-based clamp values that collapsed to ~70px / ~55px / ~14px at 390px viewport |
| `src/components/RecipeCard/RecipeCard.module.css` | Added `@media (hover: none)` block setting `.actionsButton { opacity: 1 }` | Fixes the ⋯ button being invisible on touch devices where hover never fires |
| `src/components/RecipeCard/RecipeCard.module.css` | Added `@media (max-width: 480px)` block for `.skeletonMedia` to `height: 160px` | Keeps skeleton consistent with real media height at mobile |
| `src/components/RecipeCardCarousel/RecipeCardCarousel.module.css` | Added `min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` to `.title` | Prevents long carousel section titles from overflowing and pushing arrow buttons off-screen |
| `src/components/RecipeCardCarousel/RecipeCardCarousel.module.css` | Added `@media (max-width: 480px)` block: `.header { gap: 8px }`, `.controls { flex-shrink: 0 }`, `.item { flex/width: min(280px, 85vw) }` | Reduces header gap and widens carousel items to use 85vw at mobile (vs 70vw) so cards fill the screen better |
| `.playwright-mcp/before-mobile-home.png` | Before screenshot at 390x844 | Visual evidence |
| `.playwright-mcp/before-mobile-discover.png` | Before screenshot (discover) | Visual evidence |
| `.playwright-mcp/after-mobile-home.png` | After screenshot at 390x844 | Visual evidence |
| `.playwright-mcp/after-mobile-discover.png` | After screenshot (discover) | Visual evidence |

## Pre-existing issues (not introduced by this PR)

`yarn build` fails with `TypeError: Cannot read properties of null (reading 'useState')` in the Next.js SSR pipeline. This is a React version conflict in `_app.js` that predates this branch (confirmed by `git stash` + running build on unmodified code — same error).

## Test Run

Command: `yarn test --testPathPatterns="RecipeCard"`

Result: PASS — 16 tests passed, 0 failed

```
PASS src/components/RecipeCard/RecipeCard.test.tsx
  RecipeCard
    √ renders recipe card with basic information (79 ms)
    √ shows creator information when provided (4 ms)
    √ shows date when no creator information provided (2 ms)
    √ handles zero saves count (2 ms)
    √ handles undefined saves count (2 ms)
    √ shows actions menu when showActions is true (7 ms)
    √ hides actions menu when showActions is false (2 ms)
    √ shows actions menu by default when showActions is not specified (4 ms)
    √ hides actions menu in minimal mode (2 ms)
    √ navigates to recipe page when clicked (9 ms)
    √ displays recipe image when provided (4 ms)
    √ displays emoji fallback when no image (3 ms)
    √ shows NEW badge for recent recipes (2 ms)
    √ does not show NEW badge for old recipes (1 ms)
    √ displays tags correctly (1 ms)
    √ shows +more indicator when there are more than 3 tags (3 ms)

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        2.15 s
```

Lint: `yarn lint --max-warnings=0` — No ESLint warnings or errors
