## Feature Request (verbatim)

I would like you to investigate migrating the changes from book cook v2 into book cook v1 this should include:
1. The new component system — we no longer are using Fluent
2. Any UI changes or new components

Do not worry about the backend stuff yet just focus on getting us off Fluent and using the new controls I have in the repo minus some of the overly written buggy components like the thing that lets you select your tags.

---

## Plain-Language Summary

Replace every Fluent UI component and its associated styling infrastructure in v1 with the custom CSS-module component system from v2, bringing across the new layout shell, page structures, and all stable v2 components, while excluding the TagEditor component (identified as overly complex and buggy).

---

## Codebase Findings

### v1 — Fluent UI surface area

**`C:/code/Personal/book-cook/src/pages/_app.tsx`**
Bootstraps the app with `RendererProvider` (Griffel CSS-in-JS renderer), `SSRProvider` (Fluent SSR utility), and an `isMounted` gate that delays all rendering to avoid Griffel hydration mismatches. Both providers and the mount gate exist solely because of Fluent/Griffel. They are the root of the problem to be removed.

**`C:/code/Personal/book-cook/src/components/AppContainer.tsx`**
Wraps every page in `FluentProvider` with a hand-crafted lavender `BrandVariants` theme object. All design tokens (colors, spacing) are expressed as `@fluentui/react-theme` token references. This is the theming root that must be replaced.

**`C:/code/Personal/book-cook/src/components/Toolbar/Toolbar.tsx`**
Uses Fluent's `Toolbar`, `Link` (as `FluentLink`), and `Button` for the top navigation bar. Styles are written with `makeStyles` / `shorthands` from `@griffel/react`. The nav links, "New Recipe" button, search bar, and user-profile slot are all built on Fluent primitives.

**`C:/code/Personal/book-cook/src/components/Toolbar/SearchBar/SearchBar.tsx`**
Wraps Fluent's `SearchBox` and reads from a `SearchBoxProvider` context. The entire search-value propagation contract (`onSearchBoxValueChange` / `useSearchBox`) is used only to feed Fluent's controlled `SearchBox`.

**`C:/code/Personal/book-cook/src/components/Toolbar/UserProfile/UserProfile.tsx`**
Uses Fluent's `Avatar`, `Menu`, `MenuItem`, `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuDivider`, `Tooltip`, `Button`, and `Spinner` — the densest single-file Fluent dependency in v1.

**`C:/code/Personal/book-cook/src/components/FallbackScreens/LoadingScreen.tsx`**
Single-line: renders Fluent's `Spinner`. The entire file is a one-to-one Fluent wrapper.

**`C:/code/Personal/book-cook/src/components/FallbackScreens/Unathorized.tsx`**
Uses Fluent's `Title2`, `Body1`, `Button`, and `LockClosed24Regular` icon for the auth-required screen shown on the recipes page.

**`C:/code/Personal/book-cook/src/components/RecipeCard/RecipeCard.tsx`**
Uses Fluent's `Card`, `CardHeader`, `Text`, and `BookOpenRegular` icon. Styles are Griffel `makeStyles`.

**`C:/code/Personal/book-cook/src/components/RecipeCarousel/RecipeCarousel.tsx`**
Uses Fluent's `Title3`, `Text`, `Button`, `ArrowLeftRegular`, `ArrowRightRegular`. The carousel scroll logic is custom but the controls are Fluent.

**`C:/code/Personal/book-cook/src/components/RecipePage/RecipeContent/RecipeContent.tsx`**
Uses Fluent's `Textarea` for the edit-mode recipe body. Read-only mode delegates to a custom `MarkdownParser` component.

**`C:/code/Personal/book-cook/src/components/RecipePage/RecipeHeader/RecipeHeader.tsx`**
Uses Fluent's `Display`, `Text`, `Button`, `Tooltip`, `Input`, and four Fluent icons (`CheckmarkRegular`, `DismissRegular`, `EditRegular`, `DeleteRegular`).

**`C:/code/Personal/book-cook/src/components/RecipePage/RecipeImage/RecipeImage.tsx`**
Uses Fluent's `ImageRegular` icon and `Text` for the placeholder state.

**`C:/code/Personal/book-cook/src/components/RecipePage/RecipePage.tsx`**
Uses Fluent's `Divider` as a structural separator between the header and content sections.

**`C:/code/Personal/book-cook/src/components/RecipePage/RecipeTags/RecipeTags.tsx`**
Uses Fluent's `Input` and `AddRegular` icon to implement an inline tag-entry field on the recipe detail page.

**`C:/code/Personal/book-cook/src/components/TagPicker/TagPicker.tsx`**
Uses only a single Fluent icon (`SearchRegular`). The rest is custom logic — a text input, dropdown, and tag pill list.

**`C:/code/Personal/book-cook/src/components/Typography/utils/createText.tsx`**
Wraps Fluent's internal unstable text primitives (`renderText_unstable`, `useText_unstable`, `useTextStyles_unstable`) and Griffel's `mergeClasses`. The entire Typography component tree in v1 (`Body1`, `Display`, `LargeTitle`) is built on top of this utility.

**`C:/code/Personal/book-cook/src/pages/recipes.tsx`**
Uses Fluent's `Text`, `Title3`, `Dropdown`, `Option`, `SelectionEvents`, `OptionOnSelectData` for the recipe list page header and sort control. The `TagFilter` usage is already commented out.

**`C:/code/Personal/book-cook/src/pages/newRecipe.tsx`**
Uses Fluent's `Field`, `Input`, `Textarea`, and `Button` for the new-recipe creation form.

**`C:/code/Personal/book-cook/src/components/LandingPage/LandingPage.tsx`**
Uses Fluent's `Button`, `Text`, `Card`, `CardPreview`, `CardHeader`, and five Fluent icons for the marketing/hero landing page.

---

### v2 — replacement component system

**`C:/code/Personal/book-cook2/src/components/Theme/ThemeProvider.tsx`** + **`theme.module.css`**
The Fluent `FluentProvider` + `BrandVariants` object is replaced by a `ThemeProvider` that applies a CSS class (`styles.light` or `styles.dark`) to `document.documentElement`. All design tokens are CSS custom properties defined in `theme.module.css` under `.light` / `.dark` selectors (e.g. `--brand-Primary`, `--ui-Canvas`, `--ui-TextPrimary`). There is no JavaScript token object and no CSS-in-JS runtime.

**`C:/code/Personal/book-cook2/src/app/Providers.tsx`**
Replaces `_app.tsx`'s provider stack. Uses only `QueryClientProvider` and `ThemeProvider`. No `RendererProvider`, no `SSRProvider`, no `isMounted` gate.

**`C:/code/Personal/book-cook2/src/app/global.css`**
Defines `:root` variables for font stacks and motion constants, plus a universal `box-sizing: border-box` reset. This is the base stylesheet that replaces Griffel's global injection.

**`C:/code/Personal/book-cook2/src/components/AppShell/AppShell.tsx`**
Replaces `AppContainer`. Renders a two-column layout (`AppSidebar` + `<main>`) using a CSS module. There is no top navigation bar — navigation is in the sidebar.

**`C:/code/Personal/book-cook2/src/components/Sidebar/Sidebar.tsx`**
Replaces the Fluent `Toolbar` top nav bar with a collapsible left sidebar. Includes a toggle button, responsive auto-collapse at a breakpoint, a profile footer slot, and section open/close state. Uses `@phosphor-icons/react` (`SidebarSimpleIcon`) instead of `@fluentui/react-icons`.

**`C:/code/Personal/book-cook2/src/components/Button/Button.tsx`**
Replaces Fluent's `Button`. Props: `variant` (primary | secondary | ghost | destructive), `size` (xs | sm | md | lg), `shape` (default | pill | square), `fullWidth`, `isLoading`, `startIcon`, `endIcon`. Styles are CSS modules. No `appearance` prop — that is a Fluent-ism.

**`C:/code/Personal/book-cook2/src/components/Input/Input.tsx`**
Replaces Fluent's `Input` and `Field`. Props include `label`, `description`, `error`, `size`, `variant`, `startIcon`, `endIcon`, `fullWidth`. Accessibility IDs are managed by `useFormFieldIds` hook. Standard controlled `onChange` signature (not the Fluent `(_ev, data) => {}` pattern).

**`C:/code/Personal/book-cook2/src/components/Searchbox/Searchbox.tsx`**
Replaces Fluent's `SearchBox`. Controlled and uncontrolled modes, clear button, `onValueChange` callback, `onSubmit` callback for Enter key. Uses `@phosphor-icons/react` (`MagnifyingGlassIcon`, `XIcon`).

**`C:/code/Personal/book-cook2/src/components/Typography/Typography.tsx`**
Replaces the `createText`-based Typography system. Exports named presets: `RecipeTitle`, `PageTitle`, `SectionHeading`, `SubsectionHeading`, `FocusStep`, `BodyText`, `MetaLabel`. All render plain HTML elements styled with CSS modules. No Fluent internals.

**`C:/code/Personal/book-cook2/src/components/RecipeCard/RecipeCard.tsx`**
Replaces the Fluent `Card`/`CardHeader`-based v1 card. CSS modules only. Includes skeleton loading state, interactive (button) vs. non-interactive (article) rendering, emoji fallback, and `showMeta` flag. Props: `recipe`, `onClick`, `isLoading`, `showMeta`, `className`.

**`C:/code/Personal/book-cook2/src/components/RecipeCardGallery/RecipeCardGallery.tsx`**
A grid-layout gallery container not present in v1. Renders a `ul` grid of `RecipeCard` items or skeleton cards when `isLoading=true`.

**`C:/code/Personal/book-cook2/src/components/RecipeCardCarousel/RecipeCardCarousel.tsx`**
Replaces the v1 `RecipeCarousel`. Uses `embla-carousel-react` instead of custom scroll state. Keyboard navigation (Arrow keys, Home, End). Prev/next controls use the v2 `Button`.

**`C:/code/Personal/book-cook2/src/components/RecipeView/RecipeView.tsx`** + `RecipeHeader/RecipeHeader.tsx`
Replaces v1's `RecipePage` + sub-components. The `RecipeHeader` uses a Notion-style `contentEditable` `<h1>` for title editing in editor mode instead of a Fluent `Input`. Tags are displayed via `RecipeTags` (which wraps `Tag`). A cover image is shown as a `background-image` on a `div`. Uses `@phosphor-icons/react` icons throughout.

**`C:/code/Personal/book-cook2/src/components/TextEditor/TextEditor.tsx`**
Replaces v1's `Textarea`-based recipe content editing. A full Lexical rich-text editor with markdown shortcuts, list support, a slash-command menu, and a read-only viewer mode. Completely replaces the `MarkdownParser` + `Textarea` combination in v1's `RecipeContent`.

**`C:/code/Personal/book-cook2/src/components/NewRecipeDialog/NewRecipeDialog.tsx`**
Replaces v1's `/newRecipe` page. A modal dialog (using the v2 `Dialog` component) that takes only a title and immediately navigates to the new recipe's editor on creation.

**`C:/code/Personal/book-cook2/src/components/Dialog/Dialog.tsx`**
Not present in v1. Wraps `@radix-ui/react-dialog`. Compound API: `Dialog`, `DialogTrigger`, `DialogContent` (with size sm/md/lg), `DialogHeader`, `DialogTitle`, `DialogBody`, `DialogFooter`, `DialogClose`.

**`C:/code/Personal/book-cook2/src/components/Menu/Menu.tsx`**
Replaces Fluent's `Menu`/`MenuTrigger`/`MenuPopover`/`MenuList`/`MenuDivider`. Wraps `@radix-ui/react-dropdown-menu`. Used in the sidebar's user-profile section.

**`C:/code/Personal/book-cook2/src/components/Dropdown/Dropdown.tsx`**
Replaces Fluent's `Dropdown`/`Option`. Wraps `@radix-ui/react-select`. Compound API: `Dropdown`, `DropdownTrigger`, `DropdownContent`, `DropdownItem`, `DropdownCaret`, `DropdownGroup`, `DropdownSeparator`, `DropdownValue`.

**`C:/code/Personal/book-cook2/src/components/Tooltip/Tooltip.tsx`**
Replaces Fluent's `Tooltip`. Wraps `@radix-ui/react-tooltip`. Props: `content`, `side`, `align`, `delay`, `offset`, `disabled`, `withArrow`.

**`C:/code/Personal/book-cook2/src/components/Avatar/Avatar.tsx`**
Replaces Fluent's `Avatar`. Shows a `next/image` photo or computed initials with a deterministic background color from `getAvatarColors`. Props: `imageURL`, `name`, `size` (sm/md/lg), `onClick`.

**`C:/code/Personal/book-cook2/src/components/Tag/Tag.tsx`**
Replaces the inline tag-pill `<span>` elements scattered across v1. Supports interactive (button) and non-interactive (span) modes, `startIcon`, `endIcon`, `onEndIconClick`.

**`C:/code/Personal/book-cook2/src/components/Toast/Toast.tsx`**
Not present in v1. Wraps `sonner`'s `Toaster` with Book Cook CSS module styles. Replaces `alert()` calls used in `newRecipe.tsx`.

**`C:/code/Personal/book-cook2/src/components/Stack/Stack.tsx`**
Not present in v1. A layout primitive with `direction`, `gap`, `align`, and `wrap` props, rendered as a CSS module flexbox container.

**`C:/code/Personal/book-cook2/src/components/Auth/GoogleSignInButton.tsx`**
Not present in v1. The sign-in landing page in v2 uses this dedicated button component instead of a generic Fluent `Button`.

**`C:/code/Personal/book-cook2/src/components/MultiSelectMenu/MultiSelectMenu.tsx`**
Used on the recipe gallery page for tag filtering. Wraps `cmdk`'s `Command` with a custom input-control that shows selected tags inline. This is the stable replacement for the tag-filtering concern on the recipes list page (separate from the `TagEditor` on the recipe detail page).

**`C:/code/Personal/book-cook2/src/components/TagEditor/TagEditor.tsx`** (excluded)
An in-place tag editing component on the recipe detail page. Uses `cmdk`'s `Command` for autocomplete, an edit-mode toggle, and commit-on-blur via `useTagEditorState`. The user has explicitly identified this as overly complex/buggy and does not want it migrated.

**`C:/code/Personal/book-cook2/src/app/RecipeGalleryPage.tsx`** + `RecipeGalleryControls.tsx`
The recipes list page in v2. Uses `Input` for search and `MultiSelectMenu` for tag filtering. URL search params drive the filter state. Replaces the Fluent `Dropdown`/sort control and the commented-out `TagFilter`.

**`C:/code/Personal/book-cook2/src/app/LandingPage.tsx`**
Minimal sign-in card (title, subtitle, `GoogleSignInButton`). Replaces v1's large animated marketing page.

---

## Feature Description

This migration removes the `@fluentui/react-components`, `@fluentui/react-icons`, `@griffel/react`, and `@fluentui/react-utilities` packages from v1 entirely and replaces every component and styling primitive they provide with the custom CSS-module component system that exists in v2. It affects every page and every component in the v1 application. The problem it solves is eliminating the Fluent/Griffel runtime dependency, its SSR hydration workaround (`isMounted` gate in `_app.tsx`), and the mismatch between v1's component vocabulary and the newer v2 design system that is now the canonical system for this product.

---

## Acceptance Criteria

### Dependency removal

1. After the migration, running `grep -r "@fluentui" src/` in the v1 repo returns zero results.
2. After the migration, running `grep -r "@griffel" src/` in the v1 repo returns zero results.
3. After the migration, `package.json` contains no entries for `@fluentui/react-components`, `@fluentui/react-context-selector`, `@fluentui/react-window-provider`, or any other `@fluentui/*` package.
4. After the migration, `package.json` contains no entries for `framer-motion` (used in v1 exclusively for page-transition animations that are not replicated in v2's simpler approach).

### App bootstrap and theming

5. The `isMounted` check and delayed render in `_app.tsx` (or its App Router equivalent) are removed. The application renders on first paint without a mount gate.
6. The `RendererProvider` and `SSRProvider` wrappers are removed from the root provider tree.
7. The `FluentProvider` and the `appBrandVariants` / `customLightTheme` objects in `AppContainer.tsx` are removed. No equivalent Fluent provider appears anywhere in the tree.
8. The root HTML element receives the CSS class `light` (matching `styles.light` from `theme.module.css`) when the app loads in light mode. Inspecting the `<html>` element in browser DevTools shows this class is present.
9. The CSS custom properties defined in `theme.module.css` (e.g. `--brand-Primary`, `--ui-Canvas`, `--ui-TextPrimary`) are resolvable from any component in the app when queried in browser DevTools.
10. The global stylesheet sets `box-sizing: border-box` on `*`, `*::before`, and `*::after`, consistent with v2's `global.css`.

### Layout shell

11. The top navigation bar (`Toolbar` component and its `SearchBar`, `Logo`, `UserProfile` sub-components) no longer exists. No horizontal bar appears at the top of any page.
12. A collapsible left sidebar (`AppShell` + `Sidebar`) is present on all authenticated pages. The sidebar renders navigation items as `SidebarItem` elements.
13. When the viewport width is below 900px, the sidebar collapses automatically (icon-only mode). When the viewport is at or above 900px, the sidebar is expanded by default.
14. Clicking the toggle button in the sidebar header expands or collapses the sidebar. The state toggles between expanded and collapsed on each click.
15. The sidebar contains a profile footer slot. When a user is authenticated, the footer displays the user's name (or email if name is absent) and their avatar image (or computed initials if no image).

### Typography

16. The `createText` utility file (`src/components/Typography/utils/createText.tsx`) no longer exists.
17. The Typography exports `Body1`, `Display`, and `LargeTitle` that were built on Fluent internals no longer exist.
18. The following v2 Typography exports are available from `src/components/Typography/`: `Text`, `RecipeTitle`, `PageTitle`, `SectionHeading`, `SubsectionHeading`, `FocusStep`, `BodyText`, `MetaLabel`. Importing any of these from `@/components` resolves without error.
19. Each Typography component renders the correct default HTML tag: `RecipeTitle` and `PageTitle` render `h1`, `SectionHeading` renders `h2`, `SubsectionHeading` renders `h3`, `BodyText` renders `p`, `MetaLabel` renders `span`.

### Button

20. The v1 `Toolbar`'s use of Fluent's `Button` is replaced with the v2 `Button`. The v2 `Button` is importable from `@/components` and accepts `variant`, `size`, `shape`, `isLoading`, `startIcon`, and `endIcon` props.
21. A `Button` with `isLoading={true}` renders a spinner element (`aria-hidden="true"`) and suppresses `startIcon` / `endIcon` / `children` text display until `isLoading` is false.
22. A `Button` with `disabled={true}` or `isLoading={true}` has the `disabled` attribute set on the underlying `<button>` element.

### Input and Searchbox

23. The `Field` + `Input` combination from Fluent used in `newRecipe.tsx` is replaced with the v2 `Input` component. The v2 `Input` renders a `<label>` element linked to the `<input>` via matching `htmlFor` / `id` values when the `label` prop is provided.
24. The v2 `Input`'s `onChange` prop follows the standard React `ChangeEvent<HTMLInputElement>` signature, not the Fluent `(_ev, data) => {}` pattern. Existing callers that used the Fluent pattern are updated to use the standard pattern.
25. The Fluent `SearchBox` in the `SearchBar` component is replaced with the v2 `Searchbox`. The `Searchbox` renders a clear button (`aria-label="Clear search"`) when the input has a non-empty value and `showClear` is not false.

### Recipe card

26. The Fluent `Card` / `CardHeader` in `RecipeCard.tsx` is replaced with the v2 `RecipeCard`. The "NEW" badge logic tied to a 24-hour creation window is not carried forward (it is not present in v2).
27. A `RecipeCard` with `isLoading={true}` renders skeleton placeholder blocks rather than recipe content. The card's `aria-busy` attribute is `"true"` when loading.
28. A `RecipeCard` with no `onClick` prop renders as an `<article>` element. A `RecipeCard` with an `onClick` prop renders as a `<button>` element.

### Recipe card gallery

29. The manual `styles.grid` `div` in `recipes.tsx` that mapped over cards is replaced with the `RecipeCardGallery` component. `RecipeCardGallery` renders a `<ul>` with `role="list"` containing `<li>` items.
30. When `isLoading={true}`, `RecipeCardGallery` renders the number of skeleton cards equal to `skeletonCount` (default 6) instead of real recipe cards.

### Recipe card carousel

31. The v1 `RecipeCarousel` component (which used Fluent `Title3`, `Text`, `Button`, and Fluent arrow icons) is replaced with the v2 `RecipeCardCarousel`. Prev/next controls are `Button` elements with `aria-label="Scroll left"` and `aria-label="Scroll right"`.
32. When the carousel has only one item, the prev/next control buttons are not rendered.
33. With the carousel focused, pressing ArrowLeft scrolls to the previous item, pressing ArrowRight scrolls to the next item, pressing Home scrolls to the first item, and pressing End scrolls to the last item.

### Recipe detail page

34. The v1 `RecipePage` and its sub-components (`RecipeHeader`, `RecipeContent`, `RecipeTags`, `RecipeImage`) are replaced by the v2 `RecipeView` component tree.
35. In viewer mode (`viewingMode="viewer"`), the recipe title renders as a `RecipeTitle` element (not a `contentEditable` element). In editor mode (`viewingMode="editor"`), the title renders as a `contentEditable h1`.
36. The Fluent `Textarea` used in `RecipeContent` for edit mode is replaced by the v2 `TextEditor` (Lexical). In viewer mode, `TextEditor` renders a read-only Lexical instance. In editor mode, `TextEditor` is editable.
37. The `MarkdownParser` component used in v1's read-only recipe view is no longer used for recipe content display. The Lexical `TextEditor` in viewer mode handles rendering.
38. The recipe detail page displays a cover image as a `div` with `background-image` when `recipe.imageURL` is set. When `imageURL` is absent, the cover `div` has no background-image style.
39. The recipe save/cancel controls rendered when editing are provided by the `RecipeSaveBar` component, which only renders when `saveState.isDirty` is true or `status` is not `"idle"`.

### New recipe creation

40. The `/newRecipe` page route is removed. Navigating to `/newRecipe` does not render the old form.
41. New recipe creation is initiated from a trigger (button or similar control) that opens the `NewRecipeDialog` modal. The dialog contains a single `Input` with `label="Title"` and two action buttons: "Cancel" (variant secondary) and "Create" (variant primary).
42. While the create mutation is pending, the "Create" button shows `isLoading={true}` and the "Cancel" button is disabled.
43. On successful creation, the dialog closes and the browser navigates to `/recipes/{id}` where `{id}` is the newly created recipe's ID.
44. Pressing Enter in the title input while the dialog is open triggers the same create action as clicking the "Create" button.

### Landing page

45. The v1 landing page (hero section, "Featured Recipes" cards, "Why Choose Book Cook" features, CTA section) is replaced with the v2 `LandingPage`. The v2 `LandingPage` renders a centered card containing the app title "Book Cook", a subtitle, and a `GoogleSignInButton`.
46. The `framer-motion` animated floating bubbles and stagger animations from the v1 landing page are not present in the migrated result.

### Fallback and auth screens

47. The `LoadingScreen` component no longer imports `Spinner` from `@fluentui/react-components`. A loading state is represented without Fluent (e.g. a CSS-animated element or a skeleton, consistent with v2 patterns).
48. The `Unauthorized` screen no longer imports from `@fluentui/react-components` or `@fluentui/react-icons`. The "Sign In" button is the v2 `Button` with `variant="primary"`.

### Tag filtering on the recipes page

49. The Fluent `Dropdown` / `Option` sort control on the recipes page (`recipes.tsx`) is replaced with the v2 `Dropdown` compound component (`Dropdown`, `DropdownTrigger`, `DropdownContent`, `DropdownItem`, `DropdownCaret`).
50. Tag filtering on the recipes page uses the `MultiSelectMenu` component from v2. When a tag is selected from the dropdown, it appears as a `Tag` inside the `MultiSelectMenu` input control. When a tag's `Tag` element is clicked inside the control, it is removed from the selection.
51. The `TagPicker` component (`src/components/TagPicker/`) is removed from the codebase. No file imports from it after the migration.

### Dialog

52. The v2 `Dialog` system (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogBody`, `DialogFooter`, `DialogClose`) is importable from `@/components` without error.
53. `DialogContent` with `withCloseButton={true}` (the default) renders a close button with `aria-label="Close dialog"` containing an `XIcon`.

### Menu

54. The Fluent `Menu` / `MenuTrigger` / `MenuPopover` / `MenuList` used in `UserProfile` is replaced with the v2 `Menu` / `MenuTrigger` / `MenuContent` components wrapping `@radix-ui/react-dropdown-menu`.

### Tooltip

55. Every use of Fluent's `Tooltip` (in `RecipeHeader` action buttons and `UserProfile`) is replaced with the v2 `Tooltip`. The v2 `Tooltip` wraps its trigger with `asChild` so no extra wrapper element is inserted.

### Avatar

56. Fluent's `Avatar` in `UserProfile` is replaced with the v2 `Avatar`. When the user has a profile image URL, the avatar renders a `next/image` element. When there is no image URL, the avatar renders the user's initials derived from their name.

### Icons

57. No `@fluentui/react-icons` imports exist anywhere in `src/` after the migration. All icons are sourced from `@phosphor-icons/react`.

### Toast

58. The `alert()` calls in the new-recipe creation flow (`newRecipe.tsx` / `NewRecipeDialog`) are replaced with calls to the `sonner` toast API (consistent with the v2 `Toast` component). The `Toast` (Toaster host) is mounted once in the root provider tree.

---

## Out of Scope

- Backend changes: no Supabase queries, MongoDB queries, Next.js API routes, or authentication provider changes are part of this work. Auth still uses next-auth (v1) or the equivalent session provider.
- The `TagEditor` component from v2 (`src/components/TagEditor/`, `useTagEditorState.ts`) is explicitly excluded. It must not be added to v1.
- Dark mode support: while `theme.module.css` in v2 defines `.dark` CSS variables, v2's `Providers.tsx` hardcodes `theme="light"`. Dark-mode toggling is out of scope for this migration.
- Storybook: v2 has a Storybook setup and story files for most components. Writing or migrating Storybook stories for v1 is not required.
- Test coverage: writing new unit or integration tests for migrated components is not part of this request. Existing passing tests must not be broken, but new tests are not required.
- The `RecipeCarousel` (v1) or `RecipeCardCarousel` (v2) being wired to a real data source: the carousel component should be migrated as a component, but plumbing it to a live query is a separate concern.
- The "Collections" and "Explore" nav links that appear in v1's `Toolbar`: these routes do not exist in v2 and their destination behavior is not defined here. Whether to include them in the v2 sidebar is a product decision, not a component migration decision.
- Settings page (`/settings`): `settings.tsx` in v1 does not use Fluent directly. It is not part of this migration.
- The `Stack` and `Accordion` components from v2: they are part of the v2 component index but are not currently consumed in any v1 page. They should be brought across as available primitives but no page-level wiring is required.

---

## Open Questions

1. **Sidebar navigation items**: v1's `Toolbar` contains links to `/recipes`, `/collections`, and `/explore`. The v2 `AppSidebar` (the concrete `Sidebar` instance in `app/` routes) was not found in the explored files. What navigation items should the v1 sidebar render, and what routes should they point to? This blocks the `AppSidebar` implementation.

2. **`SearchBoxProvider` context**: v1 passes a search value from the toolbar `SearchBar` down to the `recipes.tsx` page via `SearchBoxProvider` / `useSearchBox`. In v2, search state lives in `RecipeGalleryPage` as local `useState` and is reflected in URL search params. Should the global `SearchBoxProvider` context be removed and the search input moved into the recipe gallery page itself (matching v2's pattern), or should the global context be retained? This blocks how `Searchbox` is wired in the toolbar vs. the page.

3. **`newRecipe` route removal**: the `/newRecipe` page is the current route users navigate to for recipe creation. Removing it without a redirect will break any bookmarks or in-app links. Should the route be deleted outright, or should it issue a permanent redirect? This blocks whether the page file is deleted or replaced with a redirect.

4. **`RecipePage` context (`RecipeProvider`)**: v1's recipe detail page uses a `RecipeProvider` context that owns `isEditing`, `editableData`, `saveChanges`, `cancelEditing`, and `deleteRecipe`. v2's `RecipeView` has no equivalent context — it receives `recipe` and `viewingMode` as props, and save state flows through `RecipeViewSaveStateContext`. Should the v1 `RecipeProvider` and its associated `useRecipe` hook be replaced entirely with the v2 pattern, or adapted? This blocks how the recipe detail page (`/recipes/[id]`) is re-implemented.

5. **`GoogleSignInButton` in the landing page**: v2's landing page uses `useAuthSignInWithGoogle` from `@/clientToServer/hooks/useAuthSignInWithGoogle`, which calls Supabase OAuth. v1 uses `next-auth`'s `signIn("google")`. Since backend changes are out of scope, the sign-in hook cannot be migrated as-is. Should the v2 `LandingPage` layout be adopted with the sign-in trigger wired to v1's `signIn("google")` call instead, or is the landing page migration deferred? This blocks whether the `LandingPage` component is in scope.
