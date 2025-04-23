import * as React from "react";
import { Text } from "@fluentui/react-components";
import { motion } from "framer-motion";
import Image from "next/image";

import { useStyles } from "./RecipeImage.styles";

import { useRecipe } from "../../../context";

export const RecipeImage = () => {
  const styles = useStyles();
  const { recipe } = useRecipe();

  const defaultEmoji = "🍽️";
  const displayEmoji = recipe?.emoji ?? defaultEmoji;

  return recipe?.imageURL ? (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={styles.imageContainer}
    >
      <Image
        src={recipe.imageURL}
        alt={recipe.title}
        fill
        className={styles.recipeImage}
        sizes="(max-width: 840px) 100vw, 840px"
        priority
      />
    </motion.div>
  ) : (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={styles.emojiMainContainer}
    >
      <div className={styles.emojiContainer}>
        <Text className={styles.emoji} aria-hidden="true">
          {displayEmoji}
        </Text>
      </div>
    </motion.div>
  );
};
