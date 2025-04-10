import * as React from "react";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.pageContainer}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={styles.recipeCard}
        >
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
        </motion.div>
      </motion.div>
    </RecipeProvider>
  );
};
