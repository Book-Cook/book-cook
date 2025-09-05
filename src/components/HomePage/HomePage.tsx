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
} from "../../clientToServer";
import type { Recipe, MealPlanWithRecipes } from "../../clientToServer/types";

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

type MealWithFullInfo = { 
  recipe: Recipe; 
  datetime: Date;
  isPast: boolean;
};

const fetchUpcomingMeals = async (): Promise<{ meals: (Recipe & { isPast?: boolean })[]; currentMealIndex: number }> => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000); // Include yesterday
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const startDate = yesterday.toISOString().split('T')[0];
  const endDate = nextWeek.toISOString().split('T')[0];
  
  const response = await fetch(
    `/api/meal-plans?startDate=${startDate}&endDate=${endDate}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch meal plans');
  }
  
  const data = await response.json();
  const mealPlans: MealPlanWithRecipes[] = data.mealPlans || [];
  
  const allMeals: MealWithFullInfo[] = [];
  const currentTime = new Date();
  const seenRecipeIds = new Set<string>();
  
  mealPlans.forEach(plan => {
    // Handle time slots
    if (plan.meals.timeSlots && Array.isArray(plan.meals.timeSlots)) {
      plan.meals.timeSlots.forEach(slot => {
        slot.meals.forEach(meal => {
          const mealDateTime = new Date(`${plan.date  }T${slot.time}:00`);
          
          // Include meals from yesterday onwards, avoid duplicates
          if (meal.recipeId && !seenRecipeIds.has(meal.recipeId)) {
            const recipe = meal.recipe as any;
            if (recipe?.title) {
              allMeals.push({
                recipe: {
                  _id: meal.recipeId,
                  title: recipe.title,
                  emoji: recipe.emoji,
                  imageURL: recipe.imageURL,
                  tags: recipe.tags ?? [],
                  createdAt: '2020-01-01T00:00:00.000Z', // Old date to avoid "new" badge
                  data: '', // Not needed for carousel display
                  owner: '', // Not needed for carousel display
                  isPublic: false, // Not needed for carousel display
                },
                datetime: mealDateTime,
                isPast: mealDateTime.getTime() < currentTime.getTime()
              });
              seenRecipeIds.add(meal.recipeId);
            }
          }
        });
      });
    }
    
    // Handle legacy meal types
    const legacyMealTimes = {
      breakfast: '08:00',
      lunch: '12:00', 
      dinner: '18:30',
      snack: '15:00'
    };
    
    Object.entries(legacyMealTimes).forEach(([mealType, defaultTime]) => {
      const meal = plan.meals[mealType as keyof typeof plan.meals];
      if (meal && typeof meal === 'object' && 'recipeId' in meal) {
        const mealDateTime = new Date(`${plan.date  }T${defaultTime}:00`);
        
        // Include meals from yesterday onwards, avoid duplicates
        if (meal.recipeId && !seenRecipeIds.has(meal.recipeId)) {
          const recipe = meal.recipe as any;
          if (recipe?.title) {
            allMeals.push({
              recipe: {
                _id: meal.recipeId,
                title: recipe.title,
                emoji: recipe.emoji,
                imageURL: recipe.imageURL,
                tags: recipe.tags ?? [],
                createdAt: '2020-01-01T00:00:00.000Z', // Old date to avoid "new" badge
                data: '', // Not needed for carousel display
                owner: '', // Not needed for carousel display
                isPublic: false, // Not needed for carousel display
              },
              datetime: mealDateTime,
              isPast: mealDateTime.getTime() < currentTime.getTime()
            });
            seenRecipeIds.add(meal.recipeId);
          }
        }
      }
    });
  });
  
  // Sort by datetime (earliest first)
  allMeals.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
  
  // Find the first meal that is current or upcoming
  const currentMealIndex = allMeals.findIndex(meal => !meal.isPast);
  
  // If no upcoming meals found, default to a reasonable position near the end
  const defaultIndex = currentMealIndex >= 0 ? currentMealIndex : Math.max(0, allMeals.length - 3);
  
  return {
    meals: allMeals.slice(0, 15).map(meal => ({
      ...meal.recipe,
      isPast: meal.isPast
    })), // Show up to 15 recipes with isPast flag
    currentMealIndex: Math.min(defaultIndex, 14) // Ensure index is within bounds
  };
};

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

  const { data: upcomingMealData, refetch } = useQuery<{ meals: (Recipe & { isPast?: boolean })[]; currentMealIndex: number }>({
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
