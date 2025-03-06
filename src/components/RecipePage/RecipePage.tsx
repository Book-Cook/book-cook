import * as React from "react";
import { Divider } from "@fluentui/react-components";
import { motion } from "framer-motion";
import { RecipeProvider } from "../../context";
import { RecipeImage } from "./RecipeImage/RecipeImage";
import { RecipeHeader } from "./RecipeHeader/RecipeHeader";
import { RecipeTags } from "./RecipeTags/RecipeTags";
import { RecipeContent } from "./RecipeContent/RecipeContent";
import { useStyles } from "./RecipePage.styles";

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
          <Divider className={styles.divider} />
          <div className={styles.contentContainer}>
            <RecipeContent />
          </div>
        </motion.div>
      </motion.div>
    </RecipeProvider>
  );
};
