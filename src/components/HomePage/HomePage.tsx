import * as React from "react";
import { tokens } from "@fluentui/react-components";
import { makeStyles, shorthands } from "@griffel/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { RecipesCarousel } from "../RecipeCarousel";

import {
  fetchRecentlyViewed,
  fetchRecipeCollections,
  fetchUpcomingMeals,
} from "../../clientToServer";
import type { Recipe, UpcomingMealsResult } from "../../clientToServer/types";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: "48px",
    ...shorthands.padding("32px", "0px"),
  },
  subContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1400px",
  },
  heroSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "24px",
  },
  heroTitle: {
    fontSize: "48px",
    lineHeight: "1.2",
    fontWeight: "600",
  },
  heroSubtitle: {
    maxWidth: "600px",
    color: tokens.colorNeutralForeground2,
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
  sectionContainer: {
    width: "100%",
  },
});



const HomePage = () => {
  const styles = useStyles();
  const { data: session } = useSession();
  const router = useRouter();

  const { data: recentlyViewed } = useQuery<Recipe[]>({
    queryKey: ["recentlyViewed", session?.user?.id],
    queryFn: () => fetchRecentlyViewed(),
    enabled: Boolean(session),
  });

  const { data: recipeCollections } = useQuery<Recipe[]>({
    queryKey: ["recipeCollections", session?.user?.id],
    queryFn: () => fetchRecipeCollections(),
    enabled: Boolean(session),
  });

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: upcomingMealData, refetch } = useQuery<UpcomingMealsResult>({
    queryKey: ["mealPlans", yesterday, nextWeek], // Match the meal plan query pattern
    queryFn: fetchUpcomingMeals,
    enabled: Boolean(session),
    staleTime: 0, // No stale time - always fresh data
    gcTime: 0, // No cache - always fetch fresh
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch when component mounts
  });

  const recentlyViewedRecipes =
    recentlyViewed && recentlyViewed?.length > 0 ? recentlyViewed : [];

  const recipeCollectionsList =
    recipeCollections && recipeCollections?.length > 0 ? recipeCollections : [];

  const upcomingMealsList = upcomingMealData?.meals || [];
  const initialScrollIndex = upcomingMealData?.currentMealIndex || 0;

  // Refetch upcoming meals when navigating to home page
  React.useEffect(() => {
    if (refetch) {
      void refetch();
    }
  }, [router.asPath, refetch]);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.sectionContainer}>
          {(upcomingMealsList.length > 0 || !upcomingMealData) && (
            <RecipesCarousel
              recipes={upcomingMealsList}
              title={"Upcoming Meals"}
              isLoading={!upcomingMealData}
              initialScrollIndex={initialScrollIndex}
            />
          )}
          <RecipesCarousel
            recipes={recentlyViewedRecipes}
            title={"Recently Viewed Recipes"}
            isLoading={!recentlyViewed}
          />
          <RecipesCarousel
            recipes={recipeCollectionsList}
            title={"Favorite recipes"}
            isLoading={!recipeCollections}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
