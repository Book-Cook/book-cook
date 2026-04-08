# Review Feedback: migrate-v2-components-to-v1 (Revision 2)

## Verdict

**APPROVED**

---

## Files Read

| File                                         | What was found                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/clientToServer/types/recipes.types.ts`  | `Recipe` type extended with `emoji`, `owner`, `isPublic` (required) and `savedCount`, `viewCount`, `publishedAt`, `creatorName` (optional). New `CreateRecipeInput` type exported: `title`, `data`, `tags`, optional `imageURL`. `CreateRecipeResponse` unchanged. Barrel (`types/index.ts`) re-exports everything, making `CreateRecipeInput` reachable from `../types` import path used in `useCreateRecipe`. |
| `src/clientToServer/post/useCreateRecipe.ts` | `mutationFn` parameter type changed from `Omit<Recipe, "_id" \| "createdAt">` to `CreateRecipeInput`. Mutation body, error handling, and `onSuccess` cache invalidation are otherwise unchanged. `NewRecipeDialog` at line 29 passes `{ title, data: "", tags: [], imageURL: "" }` which satisfies `CreateRecipeInput` (imageURL is optional).                                                                  |
| 16 deleted files (confirmed via Glob)        | All 7 orphaned `.styles.ts` files, the full `Toolbar/`, `RecipeCarousel/`, `Typography/components/`, `Typography/utils/` directories, and `TagPicker/TagPicker.tsx` + `TagPicker/index.ts` are absent from disk. Glob searches for each path returned no results.                                                                                                                                               |

---

## Revision Check

| Prior issue                                                                                | Status   | Notes                                                                                                                                                         |
| ------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issue 1: Orphaned `.styles.ts` files cause hard build failure (`@griffel/react` not found) | RESOLVED | All 7 files deleted. Glob confirms none exist. Grep for `@griffel` across `src/` returns zero results. Build reported as passing with zero TypeScript errors. |

---

## Observations

- `@fluentui` grep across `src/` returns zero results. `@griffel` grep across `src/` returns zero results. Both acceptance criteria 1 and 2 are satisfied in active code.

- The `NewRecipeDialog` passes `imageURL: ""` (empty string) to `CreateRecipeInput` where the type declares `imageURL?: string`. An empty string and `undefined` are semantically different at the API layer -- the server will receive `"imageURL": ""` in the JSON body rather than the field being absent. This is unchanged behavior from before Revision 2 and is not introduced by this revision. Noted for awareness only.

- The Windows path-casing dev server error (`C:\Code` vs `C:\code`) causing the styled-jsx SSR crash is an environment artifact unrelated to this migration. The production build compiles cleanly and all 7 pages generate successfully.

- The `yarn.lock` mismatch (v1 classic format vs Yarn 4 pin in `.yarnrc.yml`) flagged in Phase 4 remains. A deliberate `yarn install` to produce a clean Yarn 4 lockfile before committing is still recommended.
