import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import { tokens } from "@fluentui/react-components";
import { RecipesCarousel } from "../RecipeCarousel";
import {
  fetchRecentlyViewed,
  fetchRecipeCollections,
} from "../../clientToServer";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { Recipe } from "../../clientToServer/types";

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
      <div className={styles.subContainer}>
        <div className={styles.sectionContainer}>
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
