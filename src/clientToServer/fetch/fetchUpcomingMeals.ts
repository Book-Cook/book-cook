import { fetchJson } from "src/utils";
import { mealTypeToTime } from "src/utils/timeSlots";
import type { Recipe, MealPlanResponseWithRecipes, UpcomingMealsResult } from "../types";

export const fetchUpcomingMeals = async (): Promise<UpcomingMealsResult> => {
  try {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const startDate = yesterday.toISOString().split('T')[0];
    const endDate = nextWeek.toISOString().split('T')[0];
    
    const data: MealPlanResponseWithRecipes = await fetchJson(
      `/api/meal-plans?startDate=${startDate}&endDate=${endDate}`
    );
    
    const mealPlans = data.mealPlans || [];
    const allMeals: Array<{ recipe: Recipe & { isPast?: boolean }; datetime: Date }> = [];
    const currentTime = new Date();
    const seenRecipeIds = new Set<string>();

    mealPlans.forEach(plan => {
      // Handle time slots
      if (plan.meals.timeSlots && Array.isArray(plan.meals.timeSlots)) {
        plan.meals.timeSlots.forEach(slot => {
          slot.meals.forEach(meal => {
            if (meal.recipeId && !seenRecipeIds.has(meal.recipeId) && meal.recipe) {
              const mealDateTime = new Date(`${plan.date}T${slot.time}:00.000Z`);
              const recipe = meal.recipe;
              
              if (recipe?.title) {
                allMeals.push({
                  recipe: {
                    _id: meal.recipeId,
                    title: recipe.title as string,
                    emoji: recipe.emoji as string,
                    imageURL: recipe.imageURL as string,
                    tags: (recipe.tags as string[]) ?? [],
                    createdAt: '2020-01-01T00:00:00.000Z', // Old date to avoid "new" badge
                    data: '',
                    owner: '',
                    isPublic: false,
                    isPast: mealDateTime.getTime() + 60 * 60 * 1000 < currentTime.getTime() // 1 hour buffer
                  },
                  datetime: mealDateTime
                });
                seenRecipeIds.add(meal.recipeId);
              }
            }
          });
        });
      }

      // Handle legacy meal types
      const legacyMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

      legacyMealTypes.forEach((mealType) => {
        const meal = plan.meals[mealType as keyof typeof plan.meals];
        if (meal && typeof meal === 'object' && 'recipeId' in meal && meal.recipe) {
          if (meal.recipeId && !seenRecipeIds.has(meal.recipeId)) {
            const defaultTime = mealTypeToTime(mealType);
            const mealDateTime = new Date(`${plan.date}T${defaultTime}:00.000Z`);
            const recipe = meal.recipe;
            
            if (recipe?.title) {
              allMeals.push({
                recipe: {
                  _id: meal.recipeId,
                  title: recipe.title as string,
                  emoji: recipe.emoji as string,
                  imageURL: recipe.imageURL as string,
                  tags: (recipe.tags as string[]) ?? [],
                  createdAt: '2020-01-01T00:00:00.000Z',
                  data: '',
                  owner: '',
                  isPublic: false,
                  isPast: mealDateTime.getTime() + 60 * 60 * 1000 < currentTime.getTime() // 1 hour buffer
                },
                datetime: mealDateTime
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
    const currentMealIndex = allMeals.findIndex(meal => !meal.recipe.isPast);
    const defaultIndex = currentMealIndex >= 0 ? currentMealIndex : Math.max(0, allMeals.length - 3);

    return {
      meals: allMeals.slice(0, 15).map(meal => meal.recipe),
      currentMealIndex: Math.min(defaultIndex, 14)
    };
  } catch (error) {
    console.error("Failed to fetch upcoming meals:", error);
    throw error;
  }
};