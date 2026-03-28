import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import styles from "./HomePage.module.css";
import { RecipeCardCarousel } from "../RecipeCardCarousel";

import { fetchAllRecipes } from "../../clientToServer/fetch/fetchAllRecipes";
import { fetchRecentlyViewed } from "../../clientToServer/fetch/fetchRecentlyViewed";

const sharedQueryOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchOnMount: false,
} as const;

const HomePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userKey = session?.user?.email;
  const hasSession = Boolean(session);

  const { data: recentlyViewed } = useQuery({
    queryKey: ["recentlyViewed", userKey],
    queryFn: fetchRecentlyViewed,
    enabled: hasSession,
    placeholderData: (previousData) => previousData,
    ...sharedQueryOptions,
  });

  const { data: recentRecipes } = useQuery({
    queryKey: ["recipes", "", "dateNewest"],
    queryFn: () => fetchAllRecipes("", "dateNewest"),
    enabled: hasSession,
    placeholderData: (previousData) => previousData,
    select: (data) => data.slice(0, 15),
    ...sharedQueryOptions,
  });

  const recentlyViewedList = recentlyViewed ?? [];
  const recentRecipesList = recentRecipes ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.sectionContainer}>
          <RecipeCardCarousel
            title="Recently Viewed Recipes"
            recipes={recentlyViewedList}
            isLoading={!recentlyViewed}
            onRecipeClick={(recipe) => router.push(`/recipes/${recipe._id}`)}
          />
          <RecipeCardCarousel
            title="Recent Recipes"
            recipes={recentRecipesList}
            isLoading={!recentRecipes}
            onRecipeClick={(recipe) => router.push(`/recipes/${recipe._id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
