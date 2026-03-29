import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import styles from "./HomePage.module.css";
import { RecipeCardCarousel } from "../RecipeCardCarousel";

import { fetchRecentlyViewed } from "../../clientToServer/fetch/fetchRecentlyViewed";
import { fetchRecipeCollections } from "../../clientToServer/fetch/fetchRecipeCollections";

const sharedQueryOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchOnMount: false,
} as const;

const EMPTY_MESSAGE = "You haven't viewed any recipes yet.";

const HomePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userKey = session?.user?.email;
  const hasSession = Boolean(session);

  const { data: recentlyViewed, isLoading: isRecentlyViewedLoading } = useQuery({
    queryKey: ["recentlyViewed", userKey],
    queryFn: fetchRecentlyViewed,
    enabled: hasSession,
    placeholderData: (previousData) => previousData,
    ...sharedQueryOptions,
  });

  const { data: favoriteRecipes, isLoading: isFavoriteLoading } = useQuery({
    queryKey: ["collections", userKey],
    queryFn: fetchRecipeCollections,
    enabled: hasSession,
    placeholderData: (previousData) => previousData,
    ...sharedQueryOptions,
  });

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.sectionContainer}>
          <RecipeCardCarousel
            title="Recently Viewed Recipes"
            recipes={recentlyViewed ?? []}
            isLoading={isRecentlyViewedLoading}
            emptyMessage={EMPTY_MESSAGE}
            onRecipeClick={(recipe) => router.push(`/recipes/${recipe._id}`)}
          />
          <RecipeCardCarousel
            title="Favorite Recipes"
            recipes={favoriteRecipes ?? []}
            isLoading={isFavoriteLoading}
            emptyMessage={EMPTY_MESSAGE}
            onRecipeClick={(recipe) => router.push(`/recipes/${recipe._id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
