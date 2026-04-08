import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import styles from "./SidebarHistory.module.css";

import { fetchRecipesPaginated } from "../../../clientToServer/fetch/fetchAllRecipes";
import { groupRecipesByTime } from "../../../utils/groupRecipesByTime";

export const SidebarHistory = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: result } = useQuery({
    queryKey: ["recipes", "", "dateNewest", [], 1],
    queryFn: () =>
      fetchRecipesPaginated({
        searchBoxValue: "",
        orderBy: "dateNewest",
        selectedTags: [],
        offset: 0,
        limit: 20,
      }),
    enabled: Boolean(session),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const recipes = result?.recipes ?? [];
  const groups = groupRecipesByTime(recipes);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className={styles.container} data-sidebar-collapsible="true">
      {groups.map((group) => (
        <div key={group.label}>
          <div className={styles.groupLabel}>{group.label}</div>
          {group.recipes.map((recipe) => (
            <button
              key={recipe._id}
              className={styles.item}
              onClick={() => router.push(`/recipes/${recipe._id}`)}
              title={recipe.title}
            >
              {recipe.title}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
