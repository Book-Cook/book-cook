import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import styles from "./HomePage.module.css";
import { RecipesCarousel } from "../RecipeCarousel";

import {
  fetchRecentlyViewed,
  fetchRecipeCollections,
  fetchUpcomingMeals,
} from "../../clientToServer";
import type { Recipe, UpcomingMealsResult } from "../../clientToServer/types";

const sharedQueryOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchOnMount: false,
} as const;

const HomePage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const hasSession = Boolean(userId);

  const { data: recentlyViewed } = useQuery<Recipe[]>({
    queryKey: ["recentlyViewed", userId],
    queryFn: fetchRecentlyViewed,
    enabled: hasSession,
    placeholderData: (previousData) => previousData,
    ...sharedQueryOptions,
  });

  const { data: recipeCollections } = useQuery<Recipe[]>({
    queryKey: ["recipeCollections", userId],
    queryFn: fetchRecipeCollections,
    enabled: hasSession,
    placeholderData: (previousData) => previousData,
    ...sharedQueryOptions,
  });

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: upcomingMealData } = useQuery<UpcomingMealsResult>({
    queryKey: ["mealPlans", userId, yesterday, nextWeek], // Match the meal plan query pattern
    queryFn: fetchUpcomingMeals,
    enabled: hasSession,
    placeholderData: (previousData) => previousData,
    ...sharedQueryOptions,
  });

  const recentlyViewedRecipes = recentlyViewed ?? [];
  const recipeCollectionsList = recipeCollections ?? [];

  const upcomingMealsList = upcomingMealData?.meals ?? [];
  const initialScrollIndex = upcomingMealData?.currentMealIndex ?? 0;

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.sectionContainer}>
          {(upcomingMealsList.length > 0 || !upcomingMealData) && (
            <RecipesCarousel
              recipes={upcomingMealsList}
              title="Upcoming Meals"
              isLoading={!upcomingMealData}
              initialScrollIndex={initialScrollIndex}
            />
          )}
          <RecipesCarousel
            recipes={recentlyViewedRecipes}
            title="Recently Viewed Recipes"
            isLoading={!recentlyViewed}
          />
          <RecipesCarousel
            recipes={recipeCollectionsList}
            title="Favorite Recipes"
            isLoading={!recipeCollections}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
