import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import styles from "./RecipeSearchFlyout.module.css";
import type { RecipeSearchFlyoutProps } from "./RecipeSearchFlyout.types";

import { fetchAllRecipes } from "../../clientToServer/fetch/fetchAllRecipes";
import { groupRecipesByTime } from "../../utils/groupRecipesByTime";

export const RecipeSearchFlyout = ({
  open,
  onOpenChange,
  recentRecipes,
}: RecipeSearchFlyoutProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: allRecipes = [] } = useQuery({
    queryKey: ["recipes", "", "dateNewest"],
    queryFn: () => fetchAllRecipes("", "dateNewest"),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (open) {
      setQuery("");
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const trimmed = query.trim().toLowerCase();

  const seen = new Set<string>();
  const defaultSource = [];
  for (const r of recentRecipes) {
    if (!seen.has(r._id)) { seen.add(r._id); defaultSource.push(r); }
  }
  for (const r of allRecipes) {
    if (defaultSource.length >= 30) {break;}
    if (!seen.has(r._id)) { seen.add(r._id); defaultSource.push(r); }
  }

  const filtered = trimmed
    ? allRecipes.filter((r) => r.title.toLowerCase().includes(trimmed))
    : defaultSource;

  const groups = groupRecipesByTime(filtered);

  const navigate = (id: string) => {
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
          <div className={styles.searchRow}>
            <MagnifyingGlassIcon size={16} className={styles.searchIcon} aria-hidden="true" />
            <input
              ref={inputRef}
              className={styles.searchInput}
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button
                className={styles.iconBtn}
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <XIcon size={13} aria-hidden="true" />
              </button>
            )}
            <DialogPrimitive.Close className={styles.iconBtn} aria-label="Close search">
              <XIcon size={13} aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          <div className={styles.results}>
            {groups.length > 0 ? groups.map((group) => (
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
                    <span className={styles.recipeTitle}>{recipe.title}</span>
                  </button>
                ))}
              </div>
            )) : trimmed ? (
              <p className={styles.empty}>No recipes found for &quot;{query}&quot;</p>
            ) : null}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
