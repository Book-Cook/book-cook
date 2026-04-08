## Feature Request (verbatim)

"Lets use playwright to polish issues with UI and ensure each page and feature is working properly and performantly"

---

## Plain-Language Summary

Write Playwright tests that verify every page and interactive component in the app renders correctly, behaves correctly under user interaction, and exposes the specific visual and functional defects discovered by code inspection of the migrated custom CSS-module system.

---

## Codebase Findings

### Pages

- `src/pages/index.tsx`
  Renders `<LandingPage>` for unauthenticated users and `<HomePage>` for authenticated users via `useSession`. Both are dynamically imported with `loading: () => null`, meaning the page returns `null` during the loading state -- no skeleton, no placeholder. This produces a blank flash on every cold load before session resolves.

- `src/pages/recipes.tsx`
  The recipes gallery page. Guards with `if (!session) return <Unauthorized />` but this check runs after hooks, so a signed-out user who navigates directly to `/recipes` sees the `<Unauthorized>` screen (not a redirect). The `FallbackScreen` priority order puts `isError` before `isLoading` before empty state before `isUnauthorized`, meaning `isUnauthorized` can never be reached from `FallbackScreen` in this file because the session guard returns early.

- `src/pages/recipes/[recipes].tsx`
  Thin wrapper that renders `<RecipePage>`. No auth guard at the page level -- `RecipePage` delegates to `RecipeProvider` and `RecipeView`. If the recipe ID is invalid or the fetch fails, the `RecipePageInner` returns `null` because `if (!recipe) return null` with no error surface to the user.

- `src/pages/newRecipe.tsx`
  The route is intentionally tombstoned. It immediately calls `router.push("/recipes")` inside `useEffect` and renders `null`. Navigating to `/newRecipe` produces a blank screen until the redirect fires.

- `src/pages/settings.tsx`
  Placeholder page. Renders a plain unstyled `<div>Settings</div>`. No layout, no AppShell, no auth guard. Reachable via URL but entirely unimplemented.

### Components

- `src/components/AppShell/AppShell.tsx` + `AppShell.module.css`
  Wraps all authenticated pages. When `session` is null, it renders only `{children}` with no sidebar. When authenticated, it renders a flex row of `<AppSidebar>` + `<main>`. The `main` has `overflow-y: auto` which is correct. The `@media (max-width: 900px)` breakpoint reduces padding but does not hide or visually change the sidebar -- sidebar collapse is handled inside the sidebar itself.

- `src/components/Sidebar/Sidebar.tsx` + `Sidebar.module.css`
  The sidebar uses `data-sidebar-hydrated` to suppress layout shift on SSR: before hydration at <=900px it renders collapsed (icon-only) via CSS. After hydration the `useMediaQuery` hook drives collapse state. The toggle button renders a `SidebarSimpleIcon` with `aria-label` of either "Expand sidebar" or "Collapse sidebar" depending on state. The active state on nav items is communicated via `aria-current="page"` but there is no visual differentiation in `SidebarItem.module.css` for `aria-current="page"` -- there is no `.item[aria-current="page"]` selector anywhere. Active items look identical to inactive items.

- `src/components/Sidebar/AppSidebar.tsx`
  The `<Sidebar>` wrapper is invoked with no `profile` prop even though `Sidebar.tsx` supports a `profile` prop that renders a footer avatar. The profile is instead rendered inline as a `<SidebarItem>` wrapped in a `<Menu>` trigger. This is the profile click menu that exposes "Sign out".

- `src/components/Sidebar/SidebarContent.tsx`
  Lists three nav items: `/recipes`, `/collections`, `/explore`. The `/collections` and `/explore` routes do not exist in `src/pages/`. Clicking those sidebar items will result in a Next.js 404 page.

- `src/components/HomePage/HomePage.tsx` + `HomePage.module.css`
  The authenticated home page uses hardcoded `mockRecentRecipes` (four placeholder recipes with empty `imageURL` and `data`). There is no API call. The "Create New Recipe" button routes to `/newRecipe` which immediately redirects back to `/recipes`. The "Browse Your Recipes" button routes correctly to `/recipes`.

- `src/components/LandingPage/LandingPage.tsx` + `LandingPage.module.css`
  Sign-in page. The `.card` uses `var(--ui-PageBackground, #ffffff)` as a fallback -- `--ui-PageBackground` is not defined in `theme.module.css` (the token does not exist in the design system). The fallback `#ffffff` is always used.

- `src/components/RecipeCard/RecipeCard.tsx` + `RecipeCard.module.css`
  The card is well-formed. Hover, focus-visible, and active states are all present. Skeleton shimmer animation is implemented. `next/image` is used with `fill` and `sizes` so images are optimized. No issues found.

- `src/components/RecipeCardCarousel/RecipeCardCarousel.tsx` + `RecipeCardCarousel.module.css`
  Keyboard navigation (ArrowLeft, ArrowRight, Home, End) is implemented. The viewport receives `tabIndex={0}` and has a `focus-visible` outline. Prev/Next buttons are disabled when at the boundary. Used on `HomePage` with mock data only.

- `src/components/RecipeCardGallery/RecipeCardGallery.module.css`
  The gallery grid uses `flex-wrap` with `flex: 1 1 240px` per item. Cards expand to fill available space. At narrow viewports, two cards per row is the practical minimum before each card becomes full-width. No explicit column-count breakpoints are set.

- `src/components/Button/Button.tsx` + `Button.module.css`
  All four variants (primary, secondary, ghost, destructive) have hover, active, and `focus-visible` states. The disabled state uses `pointer-events: none` and `opacity: 0.5`. The loading state spins a CSS spinner and hides label text. No issues found.

- `src/components/Input/Input.tsx` + `Input.module.css`
  Has hover, `focus-within`, disabled, and invalid states. Error text renders with `role="alert"` and is associated via `aria-describedby`. The `variantGhost` control uses an underline focus style (`inset 0 -2px 0 var(--brand-Primary)`) instead of the ring, which is intentional. No issues found.

- `src/components/FallbackScreens/NoDataScreen.tsx`
  Renders a plain unstyled `<div>No data available</div>`. No design, no icon, no action. This appears in the recipes gallery whenever the filtered result set is empty.

- `src/components/FallbackScreens/ErrorScreen.tsx`
  Renders a plain unstyled `<div>Error</div>`. No design, no icon, no retry action. This appears when the recipes API call fails.

- `src/components/FallbackScreens/LoadingScreen.module.css`
  Uses `var(--ui-Divider, #e0e0e0)` as a fallback. `--ui-Divider` is not defined in `theme.module.css`. The fallback is always used.

- `src/components/RecipePage/RecipePage.module.css`
  Contains six CSS classes (`.recipeCard`, `.topSection`, `.topSection` media query, `.divider`, `.contentContainer`, `.contentContainer` media query) that are no longer referenced in `RecipePage.tsx`. These are dead rules from the previous implementation.

- `src/components/RecipePage/RecipePage.tsx`
  `RecipePageInner` returns `null` when `recipe` is falsy, with no loading or error state rendered. `RecipeProvider` drives data loading, but if the fetch is in-flight or the ID is invalid, the page shows nothing.

- `src/components/RecipePage/RecipeHeader/RecipeHeader.module.css`
  The recipe title uses `font-family: 'Georgia', serif` hardcoded rather than `var(--font-serif)` which is defined in `global.css` as `"Merriweather", "Georgia", serif`. The same issue exists in `RecipeContent.module.css`. Both files bypass the design token.

- `src/components/RecipePage/RecipeContent/RecipeContent.tsx`
  This component is no longer referenced by `RecipePage.tsx` -- it was replaced by `RecipeView`. However the file still exists. `RecipeContent` references `editableData.content` which does not exist on the `editableData` type used in the context (the recipe content field is `data`, not `content`).

- `src/components/RecipeSaveBar/RecipeSaveBar.module.css`
  Uses `var(--ui-PageBackground, #ffffff)` which does not exist in the design token system. Fallback always used.

- `src/components/Auth/GoogleSignInButton.module.css`
  Sets `background-color: #ffffff` directly on the button override. This is a hardcoded white value that will not adapt to dark mode.

---

## Feature Description

The feature is a Playwright test suite that validates the visual and functional correctness of every page and major interactive component in the BookCook app after its migration from Fluent UI to a custom CSS-module design system. It targets observable regressions: broken routes, missing auth guards, invisible active states, unstyled fallback screens, hardcoded colors that bypass the token system, and loading states that produce blank flashes. The tests benefit both the developer (confidence that the migration is complete) and QA (a repeatable automated baseline against which future changes can be verified).

---

## Acceptance Criteria

### Landing Page (`/` -- unauthenticated)

1. When an unauthenticated user navigates to `http://localhost:3001/`, the page displays a card element containing the text "Book Cook" and a "Continue with Google" button within 3 seconds.
2. When an unauthenticated user navigates to `http://localhost:3001/`, the page does not display a blank white screen for more than 500ms before the sign-in card appears.
3. The "Continue with Google" button on the landing page is visible, not obscured by any other element, and has a computed width greater than 0.
4. The sign-in card on the landing page has a visible border (computed `border` is not `none` and not fully transparent).

### Home Page (`/` -- authenticated)

5. When an authenticated user navigates to `http://localhost:3001/`, the page displays the text "Welcome to BookCook" and a sidebar.
6. When an authenticated user is on the home page, a "Browse Your Recipes" button is present and clicking it navigates to `/recipes`.
7. When an authenticated user is on the home page, a "Create New Recipe" button is present and clicking it opens the New Recipe dialog (not navigates to `/newRecipe`). The dialog contains an input with placeholder "e.g. Spaghetti carbonara".

> Note: The current code routes "Create New Recipe" to `/newRecipe` which redirects back. This criterion defines the intended corrected behavior. See Open Questions.

8. When an authenticated user is on the home page, the recipe carousel labeled "Recent Recipes" is visible and contains at least one recipe card.

### Recipes Gallery Page (`/recipes` -- authenticated)

9. When an authenticated user navigates to `http://localhost:3001/recipes`, the page displays the heading "My Recipes".
10. When an unauthenticated user navigates to `http://localhost:3001/recipes`, the page displays the text "Access Restricted" and a "Sign In" button. The page does not display "My Recipes".
11. When the recipes API returns data, the gallery renders a list with `role="list"` containing at least one item with `aria-label="Loading recipe"` absent (i.e., the real cards are shown, not skeletons).
12. When the recipes API returns data and a sort option is changed via the Dropdown, the count label below "My Recipes" updates to reflect the new count without a full page reload.
13. When the recipes API has not yet responded and more than 300ms have elapsed, the gallery shows skeleton cards (elements with `aria-busy="true"` and `aria-label="Loading recipe"`).
14. When the recipes API returns zero results, the page displays the text "No data available" in place of the gallery.
15. When the recipes API returns an error, the page displays the text "Error" in place of the gallery.

> Criteria 14 and 15 encode current behavior. See Out of Scope regarding the unstyled fallback screens.

### Recipe Detail Page (`/recipes/[id]` -- authenticated)

16. When an authenticated user navigates to a valid recipe detail URL, the recipe title is visible in an `h1` element within 5 seconds.
17. When an authenticated user clicks the edit button (aria-label "Edit recipe") on the recipe detail page, the title becomes an editable input and the save (aria-label "Save changes") and cancel (aria-label "Cancel editing") buttons appear.
18. When a user is editing a recipe and clicks "Cancel editing", the title input is replaced by the original title in an `h1` and the RecipeSaveBar is not visible.
19. When a user is editing a recipe and the content is changed, the RecipeSaveBar appears at the bottom-right of the viewport with "Save" and "Cancel" buttons.
20. When a user navigates to a recipe detail URL where the ID does not correspond to any recipe, the page does not render blank indefinitely -- it displays an error state or navigates away within 5 seconds.

> Criterion 20 codifies the required fix for the `if (!recipe) return null` issue found in `RecipePageInner`. See Open Questions.

### `/newRecipe` Route

21. When any user navigates to `http://localhost:3001/newRecipe`, they are redirected to `/recipes` and the URL in the browser changes to `/recipes` within 3 seconds. The page does not remain blank after the redirect completes.

### Settings Page (`/settings`)

22. When an authenticated user navigates to `http://localhost:3001/settings`, the page renders within the AppShell (sidebar is visible) and displays meaningful content -- not a bare unstyled `<div>Settings</div>`.

> This criterion will fail against the current implementation. It defines the required end state. See Open Questions.

### Sidebar

23. When an authenticated user is on any page, the sidebar is visible as a vertical panel on the left side of the viewport.
24. When an authenticated user clicks the toggle button (aria-label "Collapse sidebar"), the sidebar width changes to the collapsed width and nav item labels are no longer visible in the DOM (they carry `aria-hidden="true"` when collapsed).
25. When the sidebar is collapsed and an authenticated user clicks the toggle button (aria-label "Expand sidebar"), the sidebar width returns to the expanded width and nav item labels are visible again.
26. When the sidebar is collapsed and the user hovers over a nav item icon, a tooltip appears showing the nav item label.
27. When an authenticated user is on `/recipes`, the "Recipes" nav item in the sidebar has `aria-current="page"` on its button element.
28. When an authenticated user clicks the profile avatar in the sidebar footer, a menu appears containing a "Sign out" item.
29. When the viewport width is 900px or less, the sidebar renders in its collapsed (icon-only) state without requiring user interaction.
30. When the viewport width is 1280px, the sidebar renders in its expanded state.

### New Recipe Dialog

31. When an authenticated user triggers the New Recipe dialog (via the "New Recipe" sidebar item) and submits a non-empty title, the dialog closes and the browser navigates to the new recipe's detail page at `/recipes/[id]`.
32. When the New Recipe dialog is open and the title input is empty, clicking "Create" does not close the dialog and does not navigate away.
33. When the New Recipe dialog is open and the user presses Enter in the title input with a non-empty value, the dialog submits (same behavior as clicking "Create").
34. When the New Recipe dialog is open and the user clicks "Cancel" or presses Escape, the dialog closes and the title input is cleared.

### Component States: Button

35. When a primary Button is hovered, its background color changes from the default value (`var(--brand-Primary)`) to a visibly different color within the transition duration.
36. When a primary Button has `disabled` attribute set, it is not interactive (pointer-events none) and has reduced opacity (computed opacity is less than 1).
37. When a Button has `isLoading={true}`, a spinner element is present in the DOM and the label text is not visible (computed color is transparent).
38. When a Button receives keyboard focus via Tab, a focus ring is visible (computed `box-shadow` is not `none`).

### Component States: Input

39. When an Input component receives focus, the control wrapper element has a visible focus ring (computed `box-shadow` is not `none`).
40. When an Input is rendered with an `error` prop value, the control border has a red color computed from `var(--danger-Primary)` and an error message element with `role="alert"` is present in the DOM.
41. When an Input is rendered with `disabled`, the control wrapper carries the `.disabled` class and the underlying `<input>` element has the HTML `disabled` attribute.

### Component States: RecipeCard

42. When a RecipeCard rendered as an interactive button is hovered, the card element has a `transform: translateY(-2px)` applied (verified via computed style).
43. When a RecipeCard rendered as an interactive button receives keyboard focus via Tab, a focus ring is visible (computed `box-shadow` contains the two-ring offset pattern defined in `RecipeCard.module.css`).

### Responsive Behavior

44. At viewport size 375x812 (mobile), the sidebar is in icon-only state and the main content area fills the remaining width without horizontal overflow (document scroll width equals viewport width).
45. At viewport size 1440x900 (desktop), the sidebar is in expanded state and the main content area is not obscured by the sidebar.

### Performance and Load Quality

46. When an authenticated user navigates to `http://localhost:3001/`, no layout shift is observable after the initial render (the sidebar position and main content position do not change after hydration completes).
47. When navigating to `/recipes`, the page does not display a blank white screen after the initial HTML is parsed -- either a loading skeleton or the real content is visible within 1 second.
48. When a recipe card image is present, the image element has a non-zero `naturalWidth` after the page is loaded (i.e., the image has loaded successfully).
49. The browser console contains no uncaught JavaScript errors on any of the following pages: `/` (unauthenticated), `/` (authenticated), `/recipes` (authenticated), `/recipes/[valid-id]` (authenticated).

---

## Out of Scope

- Backend API changes, database schema changes, or server-side logic modifications.
- Dark mode implementation. The `ThemeProvider` is hardcoded to `theme="light"` in `_app.tsx`. Dark mode token coverage is not part of this request.
- TextEditor / Lexical editor implementation. The `TextEditor` component is a dependency of `RecipeView` and `RecipeContent` but its internal behavior, toolbar, and formatting is outside scope.
- Implementing the `/collections` and `/explore` routes. These are linked from the sidebar nav but the pages do not exist. The tests may assert that clicking these items produces a 404 (documenting the broken state) but fixing the routes is not part of this work.
- Replacing the hardcoded `mockRecentRecipes` on `HomePage` with a real API call. The tests verify the carousel renders; data accuracy is a separate feature.
- Styling the `NoDataScreen` and `ErrorScreen` components beyond their current unstyled state. The acceptance criteria reflect current behavior. Styled versions are a separate design task.
- Implementing the `settings.tsx` page content. Criterion 22 defines the desired state but the settings page feature itself is not in scope.
- Replacing the `RecipeContent` component or resolving the dead code in `RecipePage.module.css`. These are cleanup tasks, not UI polish or verification.
- Adding animations or transitions not already present in the CSS.
- Any changes to authentication flow beyond verifying that existing guards work correctly.

---

## Open Questions

1. **Criterion 7 -- "Create New Recipe" button on HomePage**: The current code routes this button to `/newRecipe`, which then redirects to `/recipes`. The acceptance criterion assumes the button should instead open the `NewRecipeDialog`. Is that the intended behavior, or should the redirect behavior be preserved and the criterion changed to match?
   Blocks: whether criterion 7 is a test for the current behavior (redirect) or the corrected behavior (dialog open), and whether a code fix is required as part of this work.

2. **Criterion 20 -- Invalid recipe ID behavior**: When `RecipePageInner` finds `recipe` is null, it returns `null`. The acceptance criterion requires either an error state or a redirect. Which outcome is expected -- an error message rendered on the page, or a redirect to `/recipes`?
   Blocks: whether the test should assert the presence of error text or assert a URL change, and whether a code fix is required as part of this work.

3. **Criterion 22 -- Settings page**: The settings page is a bare placeholder. Does "working properly" include the settings page requiring real content, or should the Playwright test simply assert that the page renders inside the AppShell (sidebar visible) and not crash?
   Blocks: the pass condition for criterion 22 and whether a settings page implementation is required before these tests can be written and pass.

4. **Auth in Playwright tests**: The acceptance criteria for authenticated pages require a valid session. What mechanism should the tests use -- a real Google OAuth flow, a session fixture seeded via the database or API, or a mocked `useSession` response at the Next.js API route level?
   Blocks: the setup approach for every authenticated test. All criteria numbered 5-34, 44-49 depend on this answer.
