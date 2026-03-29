import type { Recipe } from "../components/RecipeView/RecipeView.types";

export type RecipeGroup = {
  label: string;
  recipes: Recipe[];
};

export function groupRecipesByTime(recipes: Recipe[]): RecipeGroup[] {
  const now = Date.now();
  const day = 86_400_000;
  const sevenDaysAgo = now - 7 * day;
  const thirtyDaysAgo = now - 30 * day;

  const buckets = new Map<string, Recipe[]>();
  const order: string[] = [];

  const addTo = (label: string, recipe: Recipe) => {
    if (!buckets.has(label)) {
      buckets.set(label, []);
      order.push(label);
    }
    buckets.get(label)!.push(recipe);
  };

  for (const recipe of recipes) {
    const t = new Date(recipe.createdAt).getTime();
    if (t >= sevenDaysAgo) {
      addTo("Previous 7 Days", recipe);
    } else if (t >= thirtyDaysAgo) {
      addTo("Last 30 Days", recipe);
    } else {
      const label = new Date(recipe.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      addTo(label, recipe);
    }
  }

  return order.map((label) => ({ label, recipes: buckets.get(label)! }));
}
