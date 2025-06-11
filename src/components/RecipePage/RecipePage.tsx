import * as React from "react";
import { FadeIn } from "../Animation";

import { RecipeContent } from "./RecipeContent/RecipeContent";
import { RecipeHeader } from "./RecipeHeader/RecipeHeader";
import { RecipeImage } from "./RecipeImage/RecipeImage";
import { useStyles } from "./RecipePage.styles";
import { RecipeTags } from "./RecipeTags/RecipeTags";

import { RecipeProvider } from "../../context";

export const RecipePage = () => {
  const styles = useStyles();

  return (
    <RecipeProvider>
      <FadeIn className={styles.pageContainer}>
        <FadeIn up delay={0.2} className={styles.recipeCard}>
          <div className={styles.topSection}>
            <RecipeImage />
            <div className={styles.contentContainer}>
              <RecipeHeader />
              <RecipeTags />
            </div>
          </div>
          <div className={styles.contentContainer}>
            <RecipeContent />
          </div>
        </FadeIn>
      </FadeIn>
    </RecipeProvider>
  );
};
