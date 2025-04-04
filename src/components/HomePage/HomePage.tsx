import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import { Button, Title1, Text, tokens } from "@fluentui/react-components";
import { useRouter } from "next/router";
import { RecipesCarousel } from "../RecipeCarousel";
import {
  fetchRecentlyViewed,
  fetchRecipeCollections,
} from "../../clientToServer";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Recipe } from "../../clientToServer/types";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "1400px",
    width: "100%",
    gap: "48px",
    ...shorthands.padding("32px", "0px"),
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
  const router = useRouter();
  const { data: session } = useSession();

  const handleCreateRecipe = () => {
    router.push("/newRecipe");
  };

  const navigateToRecipes = () => {
    router.push("/recipes");
  };

  const { data: recentlyViewed } = useQuery<Recipe[]>({
    queryKey: ["recentlyViewed", session?.user?.email],
    queryFn: () => fetchRecentlyViewed(),
    enabled: !!session,
  });

  const { data: recipeCollections } = useQuery<Recipe[]>({
    queryKey: ["recipeCollections", session?.user?.email],
    queryFn: () => fetchRecipeCollections(),
    enabled: !!session,
  });

  const recentlyViewedRecipes =
    recentlyViewed && recentlyViewed?.length > 0 ? recentlyViewed : [];

  const recipeCollectionsList =
    recipeCollections && recipeCollections?.length > 0 ? recipeCollections : [];

  return (
    <div className={styles.container}>
      {recentlyViewedRecipes.length === 0 && (
        <div className={styles.heroSection}>
          <Title1 className={styles.heroTitle}>Welcome to BookCook</Title1>
          <Text className={styles.heroSubtitle} size={400}>
            Your personal recipe collection organized in one place. Create,
            discover, and cook with ease.
          </Text>
          <div className={styles.buttonGroup}>
            <Button
              appearance="primary"
              size="large"
              onClick={handleCreateRecipe}
            >
              Create New Recipe
            </Button>
            <Button
              appearance="outline"
              size="large"
              onClick={navigateToRecipes}
            >
              Browse Your Recipes
            </Button>
          </div>
        </div>
      )}

      <div className={styles.sectionContainer}>
        <RecipesCarousel
          recipes={recentlyViewedRecipes}
          title={"Recently Viewed Recipes"}
        />
        <RecipesCarousel
          recipes={recipeCollectionsList}
          title={"Favorite recipes"}
        />
      </div>
    </div>
  );
};

export default HomePage;
