import * as React from "react";
import { Text } from "@fluentui/react-components";
import { ScaleOnHover } from "../../Animation";
import Image from "next/image";

import { useStyles } from "./RecipeImage.styles";

import { useRecipe } from "../../../context";

export const RecipeImage = () => {
  const styles = useStyles();
  const { recipe } = useRecipe();

  const defaultEmoji = "🍽️";
  const displayEmoji = recipe?.emoji ?? defaultEmoji;

  return recipe?.imageURL ? (
    <ScaleOnHover className={styles.imageContainer}>
      <Image
        src={recipe.imageURL}
        alt={recipe.title}
        fill
        className={styles.recipeImage}
        sizes="(max-width: 840px) 100vw, 840px"
        priority
      />
    </ScaleOnHover>
  ) : (
    <ScaleOnHover className={styles.emojiMainContainer} scale={1.02}>
      <div className={styles.emojiContainer}>
        <Text className={styles.emoji} aria-hidden="true">
          {displayEmoji}
        </Text>
      </div>
    </ScaleOnHover>
  );
};
