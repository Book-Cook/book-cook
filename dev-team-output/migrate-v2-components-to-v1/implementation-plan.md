# Implementation Plan: Migrate v2 Component System into v1

## Codebase Architecture Findings

### Files read

**v1 (target)**

- `src/pages/_app.tsx` — bootstraps app with `RendererProvider`, `SSRProvider`, `isMounted` gate, `QueryClientProvider`, and `AppContainer`
- `src/components/AppContainer.tsx` — wraps every page in `FluentProvider` with hand-crafted `BrandVariants` theme; also owns `SearchBoxProvider`, `Toolbar`, and the page `<main>` wrapper; contains `SessionProvider`
- `src/components/Toolbar/Toolbar.tsx` — top nav bar using Fluent `Toolbar`, `Button`, `Link`; nav links: /recipes, /collections, /explore; "New Recipe" button pushes to `/newRecipe`; contains `SearchBar` and `UserProfile` slots
- `src/components/Toolbar/SearchBar/SearchBar.tsx` — wraps Fluent `SearchBox`; reads/writes `SearchBoxProvider` context with Fluent `(_ev, data)` callback signature
- `src/components/Toolbar/UserProfile/UserProfile.tsx` — densest Fluent file: `Avatar`, `Tooltip`, `Menu`, `MenuItem`, `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuDivider`, `Text`, `Button`, `Spinner`
- `src/components/AppContainer.tsx` (also above) — no `@/` path alias in v1 tsconfig; imports use relative paths or `src/` prefix
- `src/context/SearchBoxProvider/SearchBoxProvider.tsx` — plain React context; no Fluent dependency; wraps a string value and a change callback
- `src/context/RecipeProvider/RecipeProvider.tsx` — owns all recipe detail edit state: `isEditing`, `editableData`, `saveChanges`, `cancelEditing`, `deleteRecipe`, `handleImageUpload`, `handleAddTag`, `handleRemoveTag`; calls `useQuery`/`useMutation` internally
- `src/pages/_app.tsx` — no `@/` alias; body background is hardcoded `#fcfaff`; global styles live in a `<style jsx global>` block
- `src/pages/index.tsx` — dynamic imports `LandingPage` or `HomePage` depending on session
- `src/pages/recipes.tsx` — uses Fluent `Text`, `Title3`, `Dropdown`, `Option`; sort state is local `useState`; reads `useSearchBox` from context; maps cards into a Griffel `styles.grid` div; `TagFilter` is commented out
- `src/pages/newRecipe.tsx` — standalone page with Fluent `Field`, `Input`, `Textarea`, `Button`; uses `alert()` for success/error; mutation signature is `mutate({ title, data, recipe, tags, imageURL })`
- `src/pages/recipes/[recipes].tsx` — one-liner: `<RecipePage />`
- `src/components/RecipePage/RecipePage.tsx` — wraps everything in `RecipeProvider`; uses Fluent `Divider` and `framer-motion`
- `src/components/RecipePage/RecipeHeader/RecipeHeader.tsx` — uses Fluent `Display`, `Text`, `Button`, `Tooltip`, `Input`; uses framer-motion; reads `useRecipe()` context
- `src/components/RecipePage/RecipeContent/RecipeContent.tsx` — uses Fluent `Textarea` for edit mode, `MarkdownParser` for read mode; reads `useRecipe()` context
- `src/components/RecipePage/RecipeTags/RecipeTags.tsx` — uses Fluent `Input`; uses framer-motion; reads `useRecipe()` context
- `src/components/RecipePage/RecipeImage/RecipeImage.tsx` — uses Fluent `ImageRegular` icon and `Text`; reads `useRecipe()` context
- `src/components/RecipeCard/RecipeCard.tsx` — uses Fluent `Card`, `CardHeader`, `Text`, `BookOpenRegular`; includes a "NEW" badge tied to 24-hour creation window
- `src/components/RecipeCarousel/RecipeCarousel.tsx` — uses Fluent `Title3`, `Text`, `Button`, `ArrowLeftRegular`, `ArrowRightRegular`; custom drag/scroll state; uses framer-motion
- `src/components/HomePage/HomePage.tsx` — uses Fluent `Title1`, `Text`, `Button`; contains mock `RecentRecipesCarousel`; pushes to `/newRecipe`
- `src/components/LandingPage/LandingPage.tsx` — full marketing page with framer-motion bubbles, Fluent `Button`, `Card`, `CardPreview`, `CardHeader`, five Fluent icons; `signIn("google")` from next-auth
- `src/components/FallbackScreens/LoadingScreen.tsx` — single line: renders Fluent `Spinner`
- `src/components/FallbackScreens/Unathorized.tsx` — uses Fluent `Title2`, `Body1`, `Button`, `LockClosed24Regular`
- `src/components/FallbackScreens/FallbackScreen.tsx` — no Fluent; orchestrates LoadingScreen, ErrorScreen, NoDataScreen, Unauthorized
- `src/components/Typography/utils/createText.tsx` — wraps Fluent unstable text internals
- `src/components/TagPicker/TagPicker.tsx` — uses only `SearchRegular` from Fluent icons; rest is custom logic
- `src/components/index.ts` — barrel: AppContainer, Typography, Toolbar, MarkdownParser, FallbackScreens, RecipeCard, TagPicker, LandingPage, HomePage
- `src/clientToServer/types/recipes.types.ts` — `CreateRecipeResponse` has `{ message: string; recipeId: string }` — note: `recipeId`, not `id` like v2's Supabase response
- `src/clientToServer/post/useCreateRecipe.ts` — mutation takes `Omit<Recipe, "_id" | "createdAt">`; returns `CreateRecipeResponse`
- `tsconfig.json` — no `@/` path alias; `baseUrl: "."`, `moduleResolution: "node"`, TypeScript 4.6
- `next.config.js` — no CSS modules config needed; standard Next.js Pages Router

**v2 (source)**

- `src/app/Providers.tsx` — `QueryClientProvider` + `ThemeProvider` only; no `RendererProvider`, no `SSRProvider`, no `isMounted`
- `src/app/global.css` — `:root` font and motion variables; `box-sizing: border-box` reset; `html, body { height: 100%; margin: 0; padding: 0 }`
- `src/components/Theme/ThemeProvider.tsx` — reads `theme` prop, writes CSS class to `document.documentElement` via `useEffect`; exports `useTheme`
- `src/components/Theme/theme.module.css` — defines `.light` and `.dark` selectors with all CSS custom properties
- `src/components/AppShell/AppShell.tsx` — two-column layout div: `AppSidebar` + `<main>`; uses `AppShell.module.css`
- `src/components/Sidebar/Sidebar.tsx` — `useMediaQuery` breakpoint collapse; `SidebarContext`; profile footer via `SidebarItem` + `Avatar`; toggle button; controlled/uncontrolled collapsed state
- `src/components/Sidebar/AppSidebar.tsx` — v2-specific: uses `useAuthSession` and `useAuthSignOut` (Supabase hooks) and `useRouter` from `next/navigation` (App Router); must be rewritten for v1 (next-auth + Pages Router)
- `src/components/Sidebar/SidebarContent.tsx` — three top items: Search (opens `SidebarSearchDialog`), New recipe (opens `NewRecipeDialog`), Recipes (navigates); uses `useSearchParams` from `next/navigation`; must be adapted for Pages Router
- `src/components/Sidebar/SidebarItem/SidebarItem.tsx` — pure UI item, no router dependency
- `src/components/Sidebar/SidebarSection/SidebarSection.tsx` — collapsible section; no router dependency
- `src/components/Sidebar/SidebarSearchDialog.tsx` — search dialog within sidebar
- `src/components/Button/Button.tsx` — `variant`, `size`, `shape`, `isLoading`, `startIcon`, `endIcon`, `fullWidth`; CSS modules
- `src/components/Input/Input.tsx` — standard `ChangeEvent<HTMLInputElement>` onChange; `label`, `description`, `error`, `startIcon`, `endIcon`, `fullWidth`; uses `useFormFieldIds`
- `src/components/Searchbox/Searchbox.tsx` — controlled + uncontrolled; `onValueChange` callback; clear button
- `src/components/Typography/Typography.tsx` — exports `RecipeTitle`, `PageTitle`, `SectionHeading`, `SubsectionHeading`, `FocusStep`, `BodyText`, `MetaLabel`; CSS modules only
- `src/components/RecipeCard/RecipeCard.tsx` — interactive (button) vs non-interactive (article); skeleton loading; CSS modules
- `src/components/RecipeCardGallery/RecipeCardGallery.tsx` — `<ul role="list">` grid; skeleton count prop
- `src/components/RecipeCardCarousel/RecipeCardCarousel.tsx` — embla-carousel; keyboard navigation; prev/next only shown when `recipes.length > 1`
- `src/components/RecipeView/RecipeView.tsx` — `recipe` prop + `viewingMode` + `editorRef`; reads `RecipeViewSaveStateContext`
- `src/components/RecipeView/RecipeHeader/RecipeHeader.tsx` — cover image as `div background-image`; `contentEditable h1` in editor mode; `RecipeTitle` in viewer mode; `RecipeTags`; reads `RecipeViewSaveStateContext`
- `src/components/RecipeView/RecipeViewSaveStateContext.tsx` — `RecipeViewSaveStateProvider` + `useRecipeViewSaveState`; owns `isDirty`, `updateTitle`, `markDataDirty`, `getTitle`
- `src/app/recipes/[id]/RecipeEditor.tsx` — wires `RecipeView` + `RecipeSaveBar` + `RecipeViewSaveStateProvider`; calls `useUpdateRecipeData`
- `src/components/RecipeSaveBar/RecipeSaveBar.tsx` — floating bar; only renders when `isDirty || status !== "idle"`
- `src/components/NewRecipeDialog/NewRecipeDialog.tsx` — uses `useCreateRecipe` + `Dialog` + `Input` + `Button`; v2 `useCreateRecipe` returns `{ id }` (Supabase shape, differs from v1's `{ recipeId }`)
- `src/components/Dialog/Dialog.tsx` — wraps `@radix-ui/react-dialog`; compound API
- `src/components/Menu/Menu.tsx` + `MenuItems.tsx` — wraps `@radix-ui/react-dropdown-menu`
- `src/components/Dropdown/Dropdown.tsx` — wraps `@radix-ui/react-select`
- `src/components/Tooltip/Tooltip.tsx` — wraps `@radix-ui/react-tooltip`
- `src/components/Avatar/Avatar.tsx` — `next/image` or initials; `getAvatarColors` utility
- `src/components/Tag/Tag.tsx` — interactive/non-interactive; `startIcon`, `endIcon`, `onEndIconClick`
- `src/components/Toast/Toast.tsx` — wraps `sonner`
- `src/components/Stack/Stack.tsx` — flexbox layout primitive
- `src/components/Auth/GoogleSignInButton.tsx` — uses v2 `Button` with Google logo SVG
- `src/components/MultiSelectMenu/MultiSelectMenu.tsx` — wraps `cmdk`; shows selected tags inline
- `src/app/LandingPage.tsx` — minimal card: title, subtitle, `GoogleSignInButton`; uses Supabase `useAuthSignInWithGoogle` (must be adapted)
- `src/app/RecipeGalleryPage.tsx` — local `useState` for search and tags; URL search params drive filter state; uses `useRecipes` Supabase hook (not the v1 MongoDB fetch)
- `src/app/RecipeGalleryControls.tsx` — `Input` for search + `MultiSelectMenu` for tags
- `src/components/index.ts` — barrel for all v2 components
- `package.json` (v2) — new deps: `@phosphor-icons/react`, `@radix-ui/react-accordion/dialog/dropdown-menu/select/tooltip`, `clsx`, `cmdk`, `embla-carousel-react`, `sonner`; removed: all `@fluentui/*`, `@griffel/*`, `framer-motion`

### Patterns and conventions observed

**v1 patterns:**

- Pages Router (`src/pages/`); no `@/` alias; imports use `../` relative paths or `src/` absolute prefix
- Griffel `makeStyles` / `shorthands` for all component styles (to be removed)
- Fluent `(_ev, data) => data.value` callback pattern in all controlled inputs
- `RecipeProvider` context owns all recipe edit state; all sub-components call `useRecipe()`
- `SearchBoxProvider` context owns search string; `AppContainer` owns state, `SearchBar` writes, `recipes.tsx` reads
- `useCreateRecipe` mutationFn takes the full recipe object; `CreateRecipeResponse` returns `recipeId` (not `id`)
- No `"use client"` directives (Pages Router server-renders by default; no App Router)

**v2 patterns:**

- CSS modules for all styles; CSS custom properties for design tokens
- Standard React `ChangeEvent<HTMLInputElement>` onChange on all inputs
- `clsx` for conditional class names
- `@phosphor-icons/react` for all icons
- `RecipeViewSaveStateContext` is separate from data-fetching; `RecipeView` only receives `recipe` prop
- App Router (`src/app/`); `"use client"` where hooks or browser APIs are used
- Components in `src/components/<Name>/` with `index.ts` re-export pattern
- Shared hooks in `src/hooks/`; shared utils in `src/utils/`

---

## Implementation Scope

This migration installs new runtime dependencies, copies the entire v2 component library into v1, and then rewrites every page and container component that currently uses Fluent or Griffel. The structural changes are minimal by design:

- **`_app.tsx`** loses `RendererProvider`, `SSRProvider`, `isMounted`; gains `ThemeProvider` and `Toast`
- **`AppContainer.tsx`** loses `FluentProvider` + `BrandVariants`; the `SearchBoxProvider`, `SessionProvider`, and page layout slot are kept and re-expressed using the v2 `AppShell` + `Sidebar`
- **`SearchBoxProvider` context** is kept as-is; the `Searchbox` component wired to it changes from Fluent to v2 — but the context moves from the toolbar into `SidebarContent`
- **`RecipeProvider` context** is kept; the sub-components inside `RecipePage` (`RecipeHeader`, `RecipeContent`, `RecipeTags`, `RecipeImage`) are replaced wholesale by the v2 `RecipeView` tree, which reads from a new `RecipeViewSaveStateContext` instead
- **`/newRecipe` page** is converted to a redirect to `/recipes`; recipe creation is moved into `NewRecipeDialog` opened from the sidebar
- **`/recipes` page** loses Griffel styles and Fluent `Dropdown`/sort control; the grid becomes `RecipeCardGallery` and the sort/filter header becomes `RecipeGalleryControls` with `MultiSelectMenu`
- **LandingPage** is replaced by the minimal v2 card layout, with `signIn("google")` from next-auth wired to the `GoogleSignInButton`
- **HomePage** (shown to authenticated users at `/`) is rewritten using v2 `Button`, `PageTitle`, and `RecipeCardCarousel`
- The **Toolbar** and all its sub-components are deleted entirely; navigation moves into the `Sidebar`/`AppShell`

Because v1 uses `moduleResolution: "node"` with no `@/` path alias, all copied v2 files must use relative imports (or `src/` prefix) rather than the `@/` alias found in v2 source files.

v1's `useCreateRecipe` returns `{ recipeId }` not `{ id }`. The `NewRecipeDialog` must be adapted to reference `data.recipeId` when navigating on success.

v2's `AppSidebar` uses Supabase hooks and `next/navigation` — it must be rewritten for v1 using `next-auth` `useSession`/`signOut` and `next/router`.

v2's `SidebarContent` uses `useSearchParams` from `next/navigation` — it must be adapted using `useRouter` from `next/router` and the existing `SearchBoxProvider` context for the search flow.

v2's `RecipeGalleryPage` uses Supabase-backed `useRecipes` with infinite pagination — v1 keeps its existing `fetchAllRecipes` hook and MongoDB data layer. The recipes page is adapted, not replaced wholesale.

---

## File-by-File Plan

### Phase 1 files — Dependencies and theming

---

**File:** `C:/code/Personal/book-cook/package.json`
**Modify**

Add to `dependencies`:

```
"@lexical/react": "^0.40.0"
"@phosphor-icons/react": "^2.1.10"
"@radix-ui/react-dialog": "^1.1.15"
"@radix-ui/react-dropdown-menu": "^2.1.16"
"@radix-ui/react-select": "^2.2.6"
"@radix-ui/react-tooltip": "^1.2.8"
"clsx": "^2.1.1"
"cmdk": "^1.1.1"
"embla-carousel-react": "^8.6.0"
"sonner": "^2.0.7"
```

Remove from `dependencies` (Phase 5, but document here):

```
"@fluentui/react-components"
"@fluentui/react-context-selector"
"@fluentui/react-window-provider"
"framer-motion"
```

---

**File:** `C:/code/Personal/book-cook/tsconfig.json`
**Modify**

Add `paths` under `compilerOptions` to enable the `src/` alias used in internal imports after copying:

```json
"paths": {
  "src/*": ["./src/*"]
}
```

This is already how v1 references modules (`import { fetchAllRecipes } from "src/clientToServer/fetch/fetchAllRecipes"`). No additional alias is needed — v2 files copied into v1 must have their `@/` imports converted to relative paths during copy.

---

**File:** `C:/code/Personal/book-cook/src/styles/global.css` _(new file)_
**Create**

Copy from `C:/code/Personal/book-cook2/src/app/global.css` verbatim. This replaces the inline `<style jsx global>` in `_app.tsx`.

---

**File:** `C:/code/Personal/book-cook/src/components/Theme/theme.module.css`
**Create**

Copy from `C:/code/Personal/book-cook2/src/components/Theme/theme.module.css` verbatim. No modifications needed — contains only CSS custom properties for `.light` and `.dark`.

---

**File:** `C:/code/Personal/book-cook/src/components/Theme/ThemeProvider.tsx`
**Create**

Copy from `C:/code/Personal/book-cook2/src/components/Theme/ThemeProvider.tsx`.

- Remove `"use client"` directive (not valid in Pages Router)
- Replace `import styles from "./theme.module.css"` — path is already relative, no change needed

---

**File:** `C:/code/Personal/book-cook/src/components/Theme/ThemeProvider.types.ts`
**Create**

Copy from `C:/code/Personal/book-cook2/src/components/Theme/ThemeProvider.types.ts` verbatim.

---

**File:** `C:/code/Personal/book-cook/src/components/Theme/index.ts`
**Create**

Copy from `C:/code/Personal/book-cook2/src/components/Theme/index.ts` verbatim.

---

### Phase 2 files — Copy primitive components from v2

For each component folder below, copy the entire folder from `C:/code/Personal/book-cook2/src/components/<Name>/` to `C:/code/Personal/book-cook/src/components/<Name>/`. After copying, apply the diff rules listed for each.

**Diff rules that apply to ALL copied components:**

1. Remove `"use client"` directives
2. Replace any `@/` import prefixes with relative paths (e.g. `@/hooks/useFormFieldIds` becomes `../../hooks/useFormFieldIds`)
3. Remove Storybook (`*.stories.tsx`) and test (`*.test.tsx`) files — these are out of scope

---

**File:** `C:/code/Personal/book-cook/src/components/Button/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Button/`

Files to copy: `Button.tsx`, `Button.module.css`, `Button.types.ts`, `index.ts`
No import path changes needed (Button has no internal cross-component imports).

---

**File:** `C:/code/Personal/book-cook/src/components/Input/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Input/`

Files to copy: `Input.tsx`, `Input.module.css`, `Input.types.ts`, `index.ts`
In `Input.tsx`: replace `import { useFormFieldIds } from "@/hooks/useFormFieldIds"` with `import { useFormFieldIds } from "../../hooks/useFormFieldIds"`.

---

**File:** `C:/code/Personal/book-cook/src/components/Searchbox/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Searchbox/`

Files to copy: `Searchbox.tsx`, `Searchbox.module.css`, `Searchbox.types.ts`, `index.ts`
In `Searchbox.tsx`: replace `import { useFormFieldIds } from "@/hooks/useFormFieldIds"` with `import { useFormFieldIds } from "../../hooks/useFormFieldIds"`.

---

**File:** `C:/code/Personal/book-cook/src/components/Typography/` _(replace existing folder)_
**Modify — replace contents with v2 version**

Delete existing files: `components/Body1/`, `components/Display/`, `components/LargeTitle/`, `utils/createText.tsx`, `utils/index.ts`, `components/index.ts`
Copy from `C:/code/Personal/book-cook2/src/components/Typography/`: `Typography.tsx`, `Typography.module.css`, `Typography.types.ts`, `index.ts`
No import path changes needed.

---

**File:** `C:/code/Personal/book-cook/src/components/Tag/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Tag/`

Files to copy: `Tag.tsx`, `Tag.module.css`, `Tag.types.ts`, `index.ts`
No import path changes needed.

---

**File:** `C:/code/Personal/book-cook/src/components/Avatar/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Avatar/`

Files to copy: `Avatar.tsx`, `Avatar.module.css`, `Avatar.types.ts`, `index.ts`, `getAvatarColors.ts` (if co-located)
In `Avatar.tsx`: check for `@/` imports and convert to relative.

---

**File:** `C:/code/Personal/book-cook/src/components/Tooltip/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Tooltip/`

Files to copy: `Tooltip.tsx`, `Tooltip.module.css`, `Tooltip.types.ts`, `index.ts`
No import path changes needed.

---

**File:** `C:/code/Personal/book-cook/src/components/Stack/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Stack/`

Files to copy: `Stack.tsx`, `Stack.module.css`, `Stack.types.ts`, `index.ts`
No import path changes needed.

---

**File:** `C:/code/Personal/book-cook/src/components/Toast/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Toast/`

Files to copy: `Toast.tsx`, `Toast.module.css`, `Toast.types.ts`, `index.ts`
No import path changes needed.

---

**File:** `C:/code/Personal/book-cook/src/hooks/useMediaQuery.ts`
**Create — copy from** `C:/code/Personal/book-cook2/src/hooks/useMediaQuery.ts`

Required by `Sidebar.tsx`.

---

**File:** `C:/code/Personal/book-cook/src/hooks/useFormFieldIds.ts`
**Create — copy from** `C:/code/Personal/book-cook2/src/hooks/useFormFieldIds.ts`

Required by `Input.tsx` and `Searchbox.tsx`.

---

**File:** `C:/code/Personal/book-cook/src/utils/toCssSize.ts`
**Create — copy from** `C:/code/Personal/book-cook2/src/utils/toCssSize.ts`

Required by `Sidebar.tsx`.

---

**File:** `C:/code/Personal/book-cook/src/utils/formatDate.ts`
**Create — copy from** `C:/code/Personal/book-cook2/src/utils/formatDate.ts`

Required by `RecipeView/RecipeHeader/RecipeHeader.tsx`.

---

**File:** `C:/code/Personal/book-cook/src/utils/formatCount.ts`
**Create — copy from** `C:/code/Personal/book-cook2/src/utils/formatCount.ts`

Required by `RecipeStats.tsx`.

---

**File:** `C:/code/Personal/book-cook/public/google-logo.svg`
**Create**

Copy from `C:/code/Personal/book-cook2/public/google-logo.svg`. Required by `GoogleSignInButton`.

---

### Phase 3 files — Copy composite components from v2

---

**File:** `C:/code/Personal/book-cook/src/components/Dialog/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Dialog/`

Files to copy: `Dialog.tsx`, `Dialog.module.css`, `Dialog.types.ts`, `index.ts`
Remove `"use client"`.

---

**File:** `C:/code/Personal/book-cook/src/components/Menu/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Menu/`

Files to copy: `Menu.tsx`, `MenuItems.tsx`, `Menu.module.css`, `Menu.types.ts`, `index.ts`
Remove `"use client"`.

---

**File:** `C:/code/Personal/book-cook/src/components/Dropdown/` _(entire folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Dropdown/`

Files to copy: `Dropdown.tsx`, `Dropdown.module.css`, `Dropdown.types.ts`, `index.ts`
Remove `"use client"`.

---

**File:** `C:/code/Personal/book-cook/src/components/RecipeCard/` _(replace existing)_
**Modify — replace with v2 version**

Delete existing: `RecipeCard.tsx`, `RecipeCard.types.ts` (v1 props were `title`, `id`, `createdDate`, `imageSrc`, `tags`)
Copy from `C:/code/Personal/book-cook2/src/components/RecipeCard/`: `RecipeCard.tsx`, `RecipeCard.module.css`, `RecipeCard.types.ts`, `index.ts`
Remove `"use client"`.
In `RecipeCard.tsx`: replace `@/` imports with relative paths. No `next/navigation` usage in this component — no router changes needed.

---

**File:** `C:/code/Personal/book-cook/src/components/RecipeCardGallery/` _(new folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/RecipeCardGallery/`

Files to copy: `RecipeCardGallery.tsx`, `RecipeCardGallery.module.css`, `RecipeCardGallery.types.ts`, `index.ts`
In `RecipeCardGallery.tsx`: replace `import { RecipeCard } from "../RecipeCard"` — already relative, no change needed. Remove `"use client"`.

---

**File:** `C:/code/Personal/book-cook/src/components/RecipeCardCarousel/` _(replace existing `RecipeCarousel`)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/RecipeCardCarousel/`

The existing `src/components/RecipeCarousel/` folder is **deleted** after the new folder is in place.
Files to copy: `RecipeCardCarousel.tsx`, `RecipeCardCarousel.module.css`, `RecipeCardCarousel.types.ts`, `index.ts`
Remove `"use client"`. Convert `@/` imports.

---

**File:** `C:/code/Personal/book-cook/src/components/MultiSelectMenu/` _(new folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/MultiSelectMenu/`

Files to copy: `MultiSelectMenu.tsx`, `MultiSelectMenu.module.css`, `MultiSelectMenu.types.ts`, `index.ts`
Remove `"use client"`. Convert `@/` imports to relative.

---

**File:** `C:/code/Personal/book-cook/src/components/Auth/` _(new folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Auth/`

Files to copy: `GoogleSignInButton.tsx`, `GoogleSignInButton.module.css`, `GoogleSignInButton.types.ts`, `index.ts`
Remove `"use client"`. `GoogleSignInButton` imports from `../Button` — already relative.

---

**File:** `C:/code/Personal/book-cook/src/components/AppShell/` _(new folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/AppShell/`

Files to copy: `AppShell.tsx`, `AppShell.module.css`, `AppShell.types.ts` (if exists), `index.ts`
In `AppShell.tsx`: replace `import { AppSidebar } from "../Sidebar"` with the v1-adapted `AppSidebar` (see Sidebar section below). Remove `"use client"`.

---

**File:** `C:/code/Personal/book-cook/src/components/Sidebar/` _(new folder)_
**Create — partial copy + adapt**

Copy from v2:

- `Sidebar.tsx` — remove `"use client"`; replace `@/hooks/useMediaQuery` with `../../hooks/useMediaQuery`; replace `@/utils/toCssSize` with `../../utils/toCssSize`
- `Sidebar.module.css` — copy verbatim
- `Sidebar.types.ts` — copy verbatim
- `SidebarContext.tsx` / `SidebarContext.ts` — copy verbatim
- `SidebarItem/SidebarItem.tsx`, `SidebarItem/SidebarItem.module.css`, `SidebarItem/index.ts` — copy verbatim; remove `"use client"`
- `SidebarSection/SidebarSection.tsx`, `SidebarSection/SidebarSection.module.css`, `SidebarSection/index.ts` — copy verbatim; remove `"use client"`
- `SidebarSearchDialog.tsx` — adapt (see below)
- `index.ts` — copy verbatim but remove the `AppSidebar` export if it re-exports the v2 `AppSidebar`; the v1-specific `AppSidebar` will be in the same folder

**`AppSidebar.tsx` — rewrite for v1** (do NOT copy v2 version):
Replace Supabase hooks with v1 equivalents:

```tsx
// v2 uses: useAuthSession, useAuthSignOut, next/navigation useRouter
// v1 uses: next-auth useSession, signOut, next/router useRouter

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
```

Replace `getAuthUserProfile(user)` with inline derivation:

```tsx
const { data: session } = useSession();
const userName = session?.user?.name ?? session?.user?.email ?? "";
const userImage = session?.user?.image ?? undefined;
```

Replace `useAuthSignOut` mutation with direct `signOut()` call:

```tsx
const handleSignOut = () => {
  signOut();
};
```

Keep the rest of the JSX structure (Sidebar, SidebarContent, Menu, MenuContent, MenuItem, Avatar) identical to v2.

**`SidebarContent.tsx` — rewrite for v1** (do NOT copy v2 version):
Replace `useSearchParams` from `next/navigation` with the v1 `SearchBoxProvider` context:

```tsx
import { useRouter } from "next/router";
import { useSearchBox } from "../../context/SearchBoxProvider/SearchBoxProvider";
```

The "Search" sidebar item opens `SidebarSearchDialog`, which on submit calls `onSearchBoxValueChange` (from `SearchBoxProvider`) and navigates to `/recipes` via `useRouter`.
The "New recipe" sidebar item opens `NewRecipeDialog`.
The "Recipes" sidebar item navigates to `/recipes` via `router.push`.
Remove the `useSearchParams` / URL-param sync — v1 keeps search state in `SearchBoxProvider` context, not URL params.

**`SidebarSearchDialog.tsx` — adapt for v1**:
Replace `onSubmit` callback signature to call `onSearchBoxValueChange` instead of building URL params. Remove `"use client"`.

---

**File:** `C:/code/Personal/book-cook/src/components/RecipeView/` _(new folder)_
**Create — copy + adapt**

Copy the entire `RecipeView` tree from v2:

- `RecipeView.tsx`
- `RecipeView.module.css`
- `RecipeView.types.ts`
- `RecipeViewSaveStateContext.tsx`
- `RecipeViewSaveStateContext.types.ts`
- `index.ts`
- `RecipeHeader/RecipeHeader.tsx`
- `RecipeHeader/RecipeHeader.module.css`
- `RecipeHeader/RecipeHeader.types.ts`
- `RecipeHeader/index.ts`
- `RecipeHeader/RecipeEmoji/RecipeEmoji.tsx`
- `RecipeHeader/RecipeEmoji/RecipeEmoji.module.css`
- `RecipeHeader/RecipeEmoji/index.ts`
- `RecipeHeader/RecipePropertyRow/RecipePropertyRow.tsx`
- `RecipeHeader/RecipePropertyRow/RecipePropertyRow.module.css`
- `RecipeHeader/RecipePropertyRow/index.ts`
- `RecipeHeader/RecipeStats/RecipeStats.tsx`
- `RecipeHeader/RecipeStats/RecipeStats.module.css`
- `RecipeHeader/RecipeStats/index.ts`
- `RecipeHeader/RecipeTags/RecipeTags.tsx`
- `RecipeHeader/RecipeTags/RecipeTags.module.css`
- `RecipeHeader/RecipeTags/index.ts`

For all files: remove `"use client"`. Convert `@/` imports to relative (`../utils/formatDate`, `../components/Typography`, etc.).

**Key type adaptation in `RecipeView.types.ts` and `RecipeHeader.types.ts`:**
v2's `Recipe` type has additional fields (`emoji`, `viewCount`, `savedCount`, `creatorName`, `owner`) not present in v1's MongoDB `Recipe`. The v2 components that use these fields must be made safe by treating them as optional (`emoji?: string`, `viewCount?: number`, etc.). The v1 `Recipe` type in `src/clientToServer/types/recipes.types.ts` must be extended or a local adapter type created.

---

**File:** `C:/code/Personal/book-cook/src/components/RecipeSaveBar/` _(new folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/RecipeSaveBar/`

Files to copy: `RecipeSaveBar.tsx`, `RecipeSaveBar.module.css`, `RecipeSaveBar.types.ts`, `index.ts`
Remove `"use client"`. Replace `@/components/Button` with `../Button`. Replace `@/components/RecipeView/RecipeViewSaveStateContext` with `../RecipeView/RecipeViewSaveStateContext`.

---

**File:** `C:/code/Personal/book-cook/src/components/NewRecipeDialog/` _(new folder)_
**Create — copy + adapt from** `C:/code/Personal/book-cook2/src/components/NewRecipeDialog/`

Files to copy: `NewRecipeDialog.tsx`, `NewRecipeDialog.module.css` (if exists), `NewRecipeDialog.types.ts`, `index.ts`
Remove `"use client"`.
Replace `import { useRouter } from "next/navigation"` with `import { useRouter } from "next/router"`.
Replace `@/` imports with relative paths.
**Critical mutation shape adaptation:** v2's `useCreateRecipe` returns `{ id }` but v1's returns `{ recipeId }`. Replace:

```tsx
// v2:
mutation.mutate(trimmed, {
  onSuccess: ({ id }) => { router.push(`/recipes/${id}`); ...}
})
// v1 adaptation:
mutation.mutate(
  { title: trimmed, data: "", tags: [], imageURL: "" },
  { onSuccess: (data) => { router.push(`/recipes/${data.recipeId}`); ...} }
)
```

The v1 mutation takes the full recipe object, not just a title string. The dialog creates the recipe with empty `data`, `tags`, and `imageURL` (matching the current `newRecipe.tsx` pattern).

---

**File:** `C:/code/Personal/book-cook/src/components/TextEditor/` _(new folder)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/TextEditor/`

Copy the entire `TextEditor` folder including `plugins/`, `TextEditorPlaceholder/`, `TextEditorSideMenu/`, `TextEditorSlashMenu/`, config files, and `index.ts`.
Remove `"use client"` from all files. Convert all `@/` imports to relative. This is the most complex component — verify all internal imports resolve after path conversion.

---

**File:** `C:/code/Personal/book-cook/src/components/Accordion/` _(new folder — available primitive, no page wiring required)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Accordion/`

Files to copy: `Accordion.tsx`, `Accordion.module.css`, `Accordion.types.ts`, `index.ts`
Remove `"use client"`. Convert `@/` imports.

---

**File:** `C:/code/Personal/book-cook/src/components/Checkbox/` _(new folder — available primitive)_
**Create — copy from** `C:/code/Personal/book-cook2/src/components/Checkbox/`

Files to copy: `Checkbox.tsx`, `Checkbox.module.css`, `Checkbox.types.ts`, `index.ts`
Remove `"use client"`. Convert `@/` imports.

---

### Phase 4 files — Update pages and app shell

---

**File:** `C:/code/Personal/book-cook/src/pages/_app.tsx`
**Modify**

Remove:

- `import { tokens } from "@fluentui/react-components"`
- `import { SSRProvider } from "@fluentui/react-utilities"`
- `import { RendererProvider, createDOMRenderer } from "@griffel/react"`
- The `isMounted` state, `useEffect`, and the `{isMounted && ...}` gate
- The `<RendererProvider>` and `<SSRProvider>` wrappers
- The inline `<style jsx global>` block

Add:

- `import "../styles/global.css"` — new global stylesheet
- `import { ThemeProvider } from "../components/Theme"`
- `import { Toaster } from "../components/Toast"` (the `sonner` Toaster host)

New provider tree:

```tsx
<QueryClientProvider client={queryClient}>
  <ThemeProvider theme="light">
    <AppContainer>
      <Component {...pageProps} />
    </AppContainer>
    <Toaster />
  </ThemeProvider>
</QueryClientProvider>
```

Keep `Head` block unchanged.

---

**File:** `C:/code/Personal/book-cook/src/components/AppContainer.tsx`
**Modify**

Remove:

- All `@fluentui/react-components` imports (`FluentProvider`, `createDarkTheme`, `createLightTheme`, `webLightTheme`, `BrandVariants`, `Theme`, `tokens`)
- The `appBrandVariants` object
- The `customLightTheme` object
- The `fluentProviderStyles` object
- The `<FluentProvider>` wrapper

Keep:

- `SessionProvider` from `next-auth/react`
- `SearchBoxProvider` context wiring (`searchBoxValue`, `onSearchBoxValueChange` state)

Replace `<Toolbar />` with `<AppShell>` wrapping:

```tsx
import { AppShell } from "./AppShell";

export const AppContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [searchBoxValue, setSearchBoxValue] = React.useState("");
  const onSearchBoxValueChange = (incomingValue: string) => {
    setSearchBoxValue(incomingValue);
  };

  return (
    <SessionProvider>
      <SearchBoxProvider value={{ searchBoxValue, onSearchBoxValueChange }}>
        <AppShell>{children}</AppShell>
      </SearchBoxProvider>
    </SessionProvider>
  );
};
```

The `<main>` wrapper that was previously here is now owned by `AppShell.tsx`.

---

**File:** `C:/code/Personal/book-cook/src/components/Toolbar/` _(entire folder)_
**Delete**

Remove `Toolbar.tsx`, `SearchBar/`, `UserProfile/`, `Logo/`, and all associated `index.ts`, `*.styles.ts` files. The barrel in `src/components/index.ts` must also be updated to remove the `Toolbar` export.

---

**File:** `C:/code/Personal/book-cook/src/components/index.ts`
**Modify**

Remove:

```ts
export * from "./AppContainer"; // AppContainer still exists but no longer barrel-exported
export * from "./Typography"; // keep — now points to v2 Typography
export * from "./Toolbar"; // remove — deleted
export * from "./TagPicker"; // remove — deleted
export * from "./LandingPage"; // remove — replaced inline
export * from "./HomePage"; // remove — replaced inline
```

Add:

```ts
export * from "./AppShell";
export * from "./Sidebar";
export * from "./Button";
export * from "./Input";
export * from "./Searchbox";
export * from "./Typography";
export * from "./Tag";
export * from "./Avatar";
export * from "./Tooltip";
export * from "./Stack";
export * from "./Toast";
export * from "./Dialog";
export * from "./Menu";
export * from "./Dropdown";
export * from "./RecipeCard";
export * from "./RecipeCardGallery";
export * from "./RecipeCardCarousel";
export * from "./RecipeView";
export * from "./RecipeSaveBar";
export * from "./NewRecipeDialog";
export * from "./TextEditor";
export * from "./MultiSelectMenu";
export * from "./Auth";
export * from "./Accordion";
export * from "./Checkbox";
export * from "./FallbackScreens";
export * from "./MarkdownParser";
```

---

**File:** `C:/code/Personal/book-cook/src/components/TagPicker/` _(entire folder)_
**Delete**

Remove `TagPicker.tsx`, `TagPicker.styles.ts`, `TagPicker.types.ts`, `index.ts`. No file imports this after the migration (the import in `recipes.tsx` is already commented out).

---

**File:** `C:/code/Personal/book-cook/src/components/LandingPage/LandingPage.tsx`
**Modify — replace implementation**

Delete: `LandingPage.styles.ts` (Griffel styles file)
Replace `LandingPage.tsx` with the v2 layout adapted for v1's next-auth:

```tsx
import * as React from "react";
import { signIn } from "next-auth/react";
import { GoogleSignInButton } from "../Auth";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogle = () => {
    setIsLoading(true);
    signIn("google");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Book Cook</h1>
        <p className={styles.subtitle}>
          Sign in to access your recipe gallery and editor.
        </p>
        <div className={styles.actions}>
          <GoogleSignInButton isLoading={isLoading} onClick={handleGoogle} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
```

Create `LandingPage.module.css`: copy from `C:/code/Personal/book-cook2/src/app/LandingPage.module.css`.
Keep `index.ts` exporting `LandingPage`.

---

**File:** `C:/code/Personal/book-cook/src/components/HomePage/HomePage.tsx`
**Modify — replace implementation**

Remove all Griffel and Fluent imports. Replace with v2 `Button`, `PageTitle`, and v2 `RecipeCardCarousel`.
The mock data array of `RecentRecipe` must be adapted to the v2 `Recipe` shape expected by `RecipeCardCarousel`. Specifically, v2 `RecipeCard` expects `recipe: Recipe` where `Recipe` has `_id`, `title`, `data`, `tags`, `createdAt`, `imageURL`. Adapt the mock array accordingly.
`handleCreateRecipe` changes from `router.push("/newRecipe")` to opening a `NewRecipeDialog` (hold open state in `HomePage`).
Delete `LandingPage.styles.ts` (already handled above — this is a different styles file in `HomePage/`). Any `makeStyles`-based styles file under `HomePage/` must also be deleted.

---

**File:** `C:/code/Personal/book-cook/src/components/FallbackScreens/LoadingScreen.tsx`
**Modify**

Remove `import { Spinner } from "@fluentui/react-components"`.
Replace `<Spinner />` with a CSS-animated spinner element:

```tsx
import styles from "./LoadingScreen.module.css";

export const LoadingScreen = () => (
  <div className={styles.spinner} role="status" aria-label="Loading" />
);
```

Create `LoadingScreen.module.css` with a simple `@keyframes` spin animation using CSS custom properties from `theme.module.css` for the color.

---

**File:** `C:/code/Personal/book-cook/src/components/FallbackScreens/Unathorized.tsx`
**Modify**

Remove all `@fluentui/react-components` and `@fluentui/react-icons` imports. Remove `makeStyles`/`shorthands`.
Replace with v2 primitives:

```tsx
import { Button } from "../Button";
import { PageTitle, BodyText } from "../Typography";
import { LockSimpleIcon } from "@phosphor-icons/react";
import { signIn } from "next-auth/react";

export const Unauthorized: React.FC = () => (
  <div className={styles.container}>
    <LockSimpleIcon size={48} />
    <PageTitle>Access Restricted</PageTitle>
    <BodyText>You need to be signed in to view your recipes</BodyText>
    <Button variant="primary" onClick={() => signIn()}>
      Sign In
    </Button>
  </div>
);
```

Create `Unathorized.module.css` (keeping the original filename spelling) with the container styles using CSS custom properties.

---

**File:** `C:/code/Personal/book-cook/src/pages/recipes.tsx`
**Modify**

Remove:

- All `@griffel/react` imports and `makeStyles` call
- All `@fluentui/react-components` imports (`Text`, `Title3`, `Dropdown`, `Option`, `SelectionEvents`, `OptionOnSelectData`)
- The `onSortOptionSelect` function (Fluent event signature)
- The `styles.grid` div with `.cardWrapper` and `.fadeIn` divs wrapping each card
- `TagFilter` import (already commented out; remove the comment block too)

Add:

- `import { PageTitle, BodyText, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownCaret, DropdownValue, RecipeCardGallery, MultiSelectMenu } from "../components"`

Replace sort control: the Fluent `<Dropdown onOptionSelect>` is replaced with the v2 `Dropdown` compound component:

```tsx
<Dropdown value={sortOption} onValueChange={setSortOption}>
  <DropdownTrigger>
    <Button variant="secondary" endIcon={<DropdownCaret />}>
      <DropdownValue />
    </Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem value="dateNewest">Sort by date (newest)</DropdownItem>
    <DropdownItem value="dateOldest">Sort by date (oldest)</DropdownItem>
    <DropdownItem value="ascTitle">Sort by title (asc)</DropdownItem>
    <DropdownItem value="descTitle">Sort by title (desc)</DropdownItem>
  </DropdownContent>
</Dropdown>
```

Replace `TagFilter` comment block with:

```tsx
<MultiSelectMenu
  label="Tags"
  options={availableTags}
  value={selectedTags}
  onChange={setSelectedTags}
/>
```

Replace the `styles.grid` div + card mapping with:

```tsx
<RecipeCardGallery
  recipes={recipes ?? []}
  isLoading={showLoadingIndicator}
  onRecipeClick={(recipe) => router.push(`/recipes/${recipe._id}`)}
/>
```

**Important:** v2 `RecipeCard` and `RecipeCardGallery` expect `recipe: Recipe` (the v2 `Recipe` type). v1's `fetchAllRecipes` returns the v1 `Recipe` type. Since the shapes overlap (`_id`, `title`, `tags`, `imageURL`, `createdAt`, `data`), no adapter is needed — just ensure the response type from `fetchAllRecipes` includes `data` and passes the v2 type check. The fields `emoji`, `viewCount`, `savedCount`, `creatorName`, `owner` are optional in the adapted v2 types, so they do not need to be present.

Replace Fluent `Title3` / `Text` header with:

```tsx
<PageTitle as="h1">My Recipes</PageTitle>
<BodyText>{recipes?.length} recipes {searchBoxValue ? `matching "${searchBoxValue}"` : "in your collection"}</BodyText>
```

Replace Griffel `makeStyles` page layout styles with a `recipes.module.css` file using plain CSS.

---

**File:** `C:/code/Personal/book-cook/src/pages/newRecipe.tsx`
**Modify — replace with redirect**

The `/newRecipe` page route must not be deleted outright (bookmarks may exist). Replace the file with a permanent redirect:

```tsx
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/recipes", permanent: true },
});

export default function NewRecipe() {
  return null;
}
```

This satisfies requirement 40 (route no longer renders the old form) while preserving bookmarks.

---

**File:** `C:/code/Personal/book-cook/src/components/RecipePage/` _(folder)_
**Modify — replace with RecipeView wiring**

The folder is repurposed: all existing files inside it are replaced.

**`RecipePage.tsx`** — rewritten to wrap v2 `RecipeView` + `RecipeEditor` pattern using v1's `RecipeProvider` context:

```tsx
import { RecipeProvider, useRecipe } from "../../context/RecipeProvider";
import { RecipeView } from "../RecipeView";
import { RecipeEditor } from "./RecipeEditor";

const RecipePageInner = () => {
  const { recipe, isLoading, error, isEditing } = useRecipe();

  if (isLoading) return <LoadingScreen />;
  if (error || !recipe) return <ErrorScreen />;

  return isEditing ? (
    <RecipeEditor recipe={recipe} />
  ) : (
    <RecipeView recipe={recipe} viewingMode="viewer" />
  );
};

export const RecipePage = () => (
  <RecipeProvider>
    <RecipePageInner />
  </RecipeProvider>
);
```

**`RecipeEditor.tsx`** _(new file inside RecipePage/)_ — analogous to v2's `RecipeEditor.tsx` but using `useRecipe()` context for save:

```tsx
import { useRef, useState } from "react";
import { $convertToMarkdownString } from "@lexical/markdown";
import { RecipeView } from "../RecipeView";
import { RecipeSaveBar } from "../RecipeSaveBar";
import { RecipeViewSaveStateProvider } from "../RecipeView/RecipeViewSaveStateContext";
import { recipeTransformers } from "../TextEditor/textEditorConfig";
import { useRecipe } from "../../context/RecipeProvider";

function RecipeEditorInner({ onCancel }: { onCancel: () => void }) {
  const editorRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const { recipe, saveChanges, cancelEditing } = useRecipe();
  // ... wire editorRef to saveChanges / cancelEditing
}
```

Delete: `RecipeHeader/`, `RecipeContent/`, `RecipeTags/`, `RecipeImage/`, `RecipePage.styles.ts` — all replaced by the v2 `RecipeView` tree.

---

**File:** `C:/code/Personal/book-cook/src/components/RecipePage/index.ts`
**Modify**

Update to only export `RecipePage` (remove sub-component exports that no longer exist).

---

**File:** `C:/code/Personal/book-cook/src/context/RecipeProvider/RecipeProvider.tsx`
**Modify (minor)**

The `RecipeProvider` context is kept. Replace `alert()` calls with `toast()` from sonner:

```tsx
import { toast } from "sonner";
// Replace: alert(`Failed to update recipe: ${error.message}`)
// With:    toast.error(`Failed to update recipe: ${error.message}`)
```

No Fluent imports exist in this file — the only change is the `alert()` replacements.

---

**File:** `C:/code/Personal/book-cook/src/context/RecipeProvider/RecipeProvider.types.ts`
**Modify**

Extend `RecipeContextType` to expose `isUpdating: boolean` (from `updateMutation.isPending`) so `RecipeEditor` can wire the save bar status without duplicating mutation state.

---

**File:** `C:/code/Personal/book-cook/src/clientToServer/types/recipes.types.ts`
**Modify**

Add optional v2-only fields to `Recipe` so the v2 `RecipeView`/`RecipeHeader` components type-check without error:

```ts
emoji?: string;
viewCount?: number;
savedCount?: number;
creatorName?: string;
owner?: string;
```

---

## Implementation Sequence

### Phase 1: Dependencies and theming infrastructure

**Reason:** All other work depends on the new packages being installed and the CSS token system being in place before any component can be written or tested.

1. Install new npm dependencies: `@phosphor-icons/react`, `@radix-ui/*` (dialog, dropdown-menu, select, tooltip), `clsx`, `cmdk`, `embla-carousel-react`, `sonner`, `@lexical/react`
2. Copy `src/styles/global.css` from v2's `app/global.css`
3. Copy `src/components/Theme/` folder from v2
4. Copy `src/hooks/useMediaQuery.ts`, `src/hooks/useFormFieldIds.ts` from v2
5. Copy `src/utils/toCssSize.ts`, `src/utils/formatDate.ts`, `src/utils/formatCount.ts` from v2
6. Copy `public/google-logo.svg` from v2
7. Modify `src/pages/_app.tsx` — remove Fluent/Griffel providers, add `ThemeProvider`, import `global.css`, add `Toaster`

### Phase 2a: Copy primitive components from v2

**Reason:** Composite components depend on primitives. All primitives can be copied in parallel.

- Button
- Input
- Searchbox
- Typography (replace existing)
- Tag
- Avatar
- Tooltip
- Stack
- Toast

### Phase 2b: Copy composite components from v2

**Reason:** Can run in parallel with Phase 2a for independent composites; composites that depend on primitives must wait for 2a.

- Dialog (depends on Button)
- Menu (depends on Button)
- Dropdown (depends on Button)
- RecipeCard (replaces existing)
- RecipeCardGallery (depends on RecipeCard)
- RecipeCardCarousel (depends on RecipeCard, Button, Typography)
- MultiSelectMenu (depends on Tag, Input, cmdk)
- Auth/GoogleSignInButton (depends on Button)
- Accordion
- Checkbox

### Phase 3: Copy and adapt complex composite components

**Reason:** These have cross-cutting dependencies that require primitives and composites to be in place, and some require v1-specific adaptations (not pure copies).

1. `TextEditor` folder — copy and convert all `@/` imports
2. `RecipeView` + `RecipeViewSaveStateContext` + all `RecipeHeader` sub-components — copy and convert; extend v1 `Recipe` type with optional fields
3. `RecipeSaveBar` — copy and convert
4. `NewRecipeDialog` — copy and adapt mutation shape for v1's `useCreateRecipe`
5. `Sidebar` folder — copy `Sidebar.tsx`, `SidebarItem`, `SidebarSection`, `SidebarSearchDialog`; **rewrite** `AppSidebar.tsx` for next-auth; **rewrite** `SidebarContent.tsx` for Pages Router + SearchBoxProvider
6. `AppShell` — copy; update import of `AppSidebar` to point to v1 version

### Phase 4: Update pages and app shell

**Reason:** Pages import components; must come after all components exist. Items within this phase are partially parallelizable.

1. `AppContainer.tsx` — remove FluentProvider/BrandVariants; swap Toolbar for AppShell; keep SearchBoxProvider and SessionProvider
2. `LandingPage` — replace with v2 minimal card layout; adapt sign-in to next-auth `signIn("google")`
3. `HomePage` — replace Fluent + framer-motion with v2 Button/PageTitle/RecipeCardCarousel
4. `FallbackScreens/LoadingScreen.tsx` — remove Fluent Spinner; write CSS spinner
5. `FallbackScreens/Unathorized.tsx` — replace Fluent with v2 Button + Typography; add CSS module
6. `pages/recipes.tsx` — replace Fluent Dropdown/Title3/Text with v2 Dropdown/Typography/RecipeCardGallery/MultiSelectMenu
7. `pages/newRecipe.tsx` — replace with server-side redirect to `/recipes`
8. `components/RecipePage/` — replace sub-components; add `RecipeEditor.tsx`; wire RecipeView/RecipeSaveBar to RecipeProvider context
9. `context/RecipeProvider/RecipeProvider.tsx` — replace `alert()` calls with sonner `toast()`
10. `src/components/index.ts` — update barrel exports
11. Delete: `components/Toolbar/`, `components/TagPicker/`, `components/RecipeCarousel/`; all `*.styles.ts` Griffel files across the deleted components

### Phase 5: Remove Fluent packages and verify

**Reason:** Must come last; verify zero Fluent imports remain before uninstalling.

1. Run `grep -r "@fluentui" src/` — must return zero results
2. Run `grep -r "@griffel" src/` — must return zero results
3. Run `grep -r "framer-motion" src/` — must return zero results
4. Remove from `package.json`: `@fluentui/react-components`, `@fluentui/react-context-selector`, `@fluentui/react-window-provider`, any other `@fluentui/*`, `framer-motion`
5. Run `npm install` (or yarn) to update lockfile
6. Run `next build` to confirm no TypeScript errors and no missing imports

---

## Technical Risks and Constraints

### 1. v1 has no `@/` path alias; all copied v2 files must be updated

v2 uses `@/` throughout (e.g. `@/hooks/useFormFieldIds`, `@/components/Button`). v1's `tsconfig.json` has `baseUrl: "."` but no `paths` entry for `@/`. Every `@/` import in copied files must be converted to a relative path before the build will pass. This is the most error-prone mechanical step.

### 2. `CreateRecipeResponse.recipeId` vs `id`

v1's `useCreateRecipe` returns `{ message: string; recipeId: string }`. v2's hook returns `{ id: string }` (Supabase shape). `NewRecipeDialog.tsx` calls `router.push("/recipes/${id}")` — this must be changed to `data.recipeId`. If this is missed, post-creation navigation silently routes to `/recipes/undefined`.

### 3. `RecipeProvider` context is retained but `RecipeView` expects props

The v2 `RecipeView` component receives `recipe` as a prop and reads `RecipeViewSaveStateContext` for dirty tracking. The v1 `RecipeProvider` context owns the same data but exposes it differently (via `useRecipe()`). The `RecipePage` wrapper must bridge these two patterns: read from `RecipeProvider`, pass as props to `RecipeView`, and wrap the editor in `RecipeViewSaveStateProvider`. This is the most architecturally delicate adaptation.

### 4. Pages Router vs App Router differences in Sidebar components

`SidebarContent.tsx` (v2) uses `useSearchParams` from `next/navigation` (App Router). In Pages Router, this hook does not exist. The v1 adaptation must use `useRouter` from `next/router` and the `SearchBoxProvider` context. If `useSearchParams` is left in place, the build will fail at runtime with a module resolution error.

### 5. `"use client"` directives must be removed

All v2 files have `"use client"` because they were written for App Router. Pages Router does not use this directive — it is meaningless in Pages Router but will not cause a build error by itself. However, it is a signal that the component was written with App Router semantics and may use hooks (`useSearchParams`, `useRouter` from `next/navigation`) that do not exist in Pages Router. Each `"use client"` removal should trigger a review of the component's router/navigation imports.

### 6. TypeScript version mismatch

v1 uses TypeScript 4.6; v2 uses TypeScript 5.9. Some v2 component files may use TypeScript 5.x syntax (e.g. `const` type parameters, template literal types, `satisfies`). If any v2 files use these features, the developer must downgrade the syntax or upgrade v1's TypeScript version as a prerequisite.

### 7. React version mismatch

v1 uses React 18; v2 uses React 19. The Radix UI and other packages in v2's `package.json` specify React 19 peer deps. The developer should verify that the React 18 versions of these packages are available as older `@radix-ui` releases, or upgrade v1 to React 18-compatible versions.

### 8. TextEditor (Lexical) complexity

`TextEditor` is the most complex component in the tree — it includes a slash-command menu, side menu, multiple plugins, and markdown transformers. The v2 implementation was built and tested against v2's data layer (Supabase). In v1, the recipe content is stored as markdown text in MongoDB. The Lexical editor's `text` prop receives this markdown string and renders it. Verify that `$convertToMarkdownString` and `recipeTransformers` produce output compatible with v1's existing recipe `data` field format.

### 9. RecipeCard type shape mismatch

v1's recipe gallery passes individual props (`title`, `id`, `createdDate`, `imageSrc`, `tags`) to the old `RecipeCard`. The v2 `RecipeCard` expects a single `recipe` object with `_id` (not `id`) and `createdAt` (not `createdDate`). The `recipes.tsx` page must pass the whole recipe object, not destructured props. The carousel in `HomePage.tsx` uses mock data that also needs its shape updated.

### 10. CSS module naming conflicts

v1 has existing CSS files that are `.styles.ts` Griffel files rather than `.module.css` files. Some component folders will have both old Griffel files and new CSS module files during the transition. Ensure all old `*.styles.ts` files are deleted as part of each component's migration to avoid stale imports.

### 11. `next.config.js` does not allow remote image patterns for avatar URLs

v2's `Avatar` uses `next/image` with a user's profile photo URL from Google OAuth. v1's `next.config.js` only permits specific `remotePatterns` hosts. The developer must add `lh3.googleusercontent.com` (Google profile image CDN) to `remotePatterns` in `next.config.js`, or replace the `next/image` in `Avatar` with a plain `<img>` tag for the MVP.

---

## Developer Team

| Specialist  | Responsibility                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Order |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `developer` | Install new deps (`@phosphor-icons/react`, `@radix-ui/*`, `clsx`, `cmdk`, `embla-carousel-react`, `sonner`, `@lexical/react`) and set up theming infrastructure: copy `global.css`, copy `Theme/` folder, copy shared hooks (`useMediaQuery`, `useFormFieldIds`) and utils (`toCssSize`, `formatDate`, `formatCount`), copy `google-logo.svg`, and update `_app.tsx`                                                                                                                                                                                                       | 1     |
| `developer` | Copy and adapt primitive components from v2: Button, Input, Searchbox, Typography (replace existing), Tag, Avatar, Tooltip, Stack, Toast, Accordion, Checkbox — all in `src/components/`; remove `"use client"`, convert `@/` imports                                                                                                                                                                                                                                                                                                                                      | 2     |
| `developer` | Copy and adapt composite components from v2: Dialog, Menu, Dropdown, RecipeCard (replace existing), RecipeCardGallery, RecipeCardCarousel, MultiSelectMenu, GoogleSignInButton, AppShell, Sidebar (copy generic components; rewrite `AppSidebar.tsx` and `SidebarContent.tsx` for next-auth + Pages Router), TextEditor, RecipeView tree, RecipeSaveBar, NewRecipeDialog (adapt mutation shape)                                                                                                                                                                            | 2     |
| `developer` | Update pages and feature components: `AppContainer.tsx` (remove Fluent, add AppShell), `LandingPage` (replace with v2 minimal card + next-auth signIn), `HomePage` (remove Fluent/framer-motion), `FallbackScreens/LoadingScreen` and `Unauthorized` (remove Fluent), `pages/recipes.tsx` (replace Fluent Dropdown + grid + TagFilter with v2 equivalents), `pages/newRecipe.tsx` (redirect), `RecipePage` tree (wire RecipeView to RecipeProvider), update `src/components/index.ts`, delete `Toolbar/`, `TagPicker/`, `RecipeCarousel/`, all `*.styles.ts` Griffel files | 3     |
| `developer` | Remove Fluent packages from `package.json` (`@fluentui/react-components`, `@fluentui/react-context-selector`, `@fluentui/react-window-provider`, `framer-motion`), run `grep -r "@fluentui" src/` and `grep -r "@griffel" src/` and `grep -r "framer-motion" src/` to verify zero results, run `next build` to confirm type-clean build, add `lh3.googleusercontent.com` to `next.config.js` remote image patterns                                                                                                                                                         | 4     |
