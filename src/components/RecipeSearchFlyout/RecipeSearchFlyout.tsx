import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import cx from "clsx";
import { useRouter } from "next/router";

import styles from "./RecipeSearchFlyout.module.css";
import type { RecipeSearchFlyoutProps } from "./RecipeSearchFlyout.types";
import { Text } from "../Text";

import { fetchAllRecipes, fetchRecipesPaginated } from "../../clientToServer/fetch/fetchAllRecipes";
import { groupRecipesByTime } from "../../utils/groupRecipesByTime";

const SEARCH_LIMIT = 50;

export const RecipeSearchFlyout = ({
  open,
  onOpenChange,
  recentRecipes,
}: RecipeSearchFlyoutProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce query by 200ms to avoid hammering the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Default recipe list (up to 30 recent + recent from collection) shown before typing
  const { data: defaultRecipes = [] } = useQuery({
    queryKey: ["recipes", "", "dateNewest"],
    queryFn: () => fetchAllRecipes("", "dateNewest"),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  // Server-side search across ALL recipes when the user types
  const { data: searchData, isFetching: isSearching } = useQuery({
    queryKey: ["recipeSearch", debouncedQuery],
    queryFn: () => fetchRecipesPaginated({
      searchBoxValue: debouncedQuery,
      orderBy: "dateNewest",
      limit: SEARCH_LIMIT,
      offset: 0,
    }),
    enabled: open && debouncedQuery.length > 0,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (open) {
      setQuery("");
      setDebouncedQuery("");
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const trimmed = query.trim().toLowerCase();

  // When no query: show recent recipes first, then fill from collection
  const seen = new Set<string>();
  const defaultSource = [];
  for (const r of recentRecipes) {
    if (!seen.has(r._id)) { seen.add(r._id); defaultSource.push(r); }
  }
  for (const r of defaultRecipes) {
    if (defaultSource.length >= 30) { break; }
    if (!seen.has(r._id)) { seen.add(r._id); defaultSource.push(r); }
  }

  const results = trimmed ? (searchData?.recipes ?? []) : defaultSource;
  const groups = groupRecipesByTime(results);
  const hasResults = groups.length > 0 || (isSearching && Boolean(trimmed));
  const showResults = hasResults || Boolean(trimmed);

  const navigate = (id: string): void => {
    void router.push(`/recipes/${id}`);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />
        <DialogPrimitive.Content
          className={styles.panel}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <DialogPrimitive.Title className={styles.srOnly}>
            Search recipes
          </DialogPrimitive.Title>
          <div className={cx(styles.searchRow, !showResults && styles.searchRowNoResults)}>
            <MagnifyingGlassIcon size={16} className={styles.searchIcon} aria-hidden="true" />
            <input
              ref={inputRef}
              className={styles.searchInput}
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            <button
              className={styles.iconBtn}
              onClick={() => (query ? setQuery("") : onOpenChange(false))}
              aria-label={query ? "Clear search" : "Close search"}
            >
              <XIcon size={13} aria-hidden="true" />
            </button>
          </div>

          {showResults && (
            <div className={styles.results}>
              {isSearching && trimmed ? (
                <Text size={300} className={styles.empty}>Searching…</Text>
              ) : groups.length > 0 ? groups.map((group) => (
                <div key={group.label} className={styles.group}>
                  <div className={styles.groupLabel}>{group.label}</div>
                  {group.recipes.map((recipe) => (
                    <button
                      key={recipe._id}
                      className={styles.recipeItem}
                      onClick={() => navigate(recipe._id)}
                      title={recipe.title}
                    >
                      <span className={styles.recipeEmoji} aria-hidden="true">
                        {recipe.emoji ?? "🍴"}
                      </span>
                      <span className={styles.recipeTitle}>{recipe.title || "Untitled Recipe"}</span>
                    </button>
                  ))}
                </div>
              )) : trimmed ? (
                <Text size={300} className={styles.empty}>No recipes found for &quot;{query}&quot;</Text>
              ) : null}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
