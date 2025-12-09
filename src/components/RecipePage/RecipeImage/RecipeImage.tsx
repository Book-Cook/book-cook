import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { useStyles } from "./RecipeImage.styles";

import { useRecipe } from "../../../context";
import { ScaleOnHover } from "../../Animation";
import { Text } from "../../Text";

const ChangeEmojiDialog = dynamic(
  () => import("../../RecipeActions/ChangeEmojiDialog"),
  {
    loading: () => null,
    ssr: false,
  }
);

const RecipeImageComponent = () => {
  const styles = useStyles();
  const { recipe, editableData, saveChanges } = useRecipe();
  const [isEmojiDialogOpen, setIsEmojiDialogOpen] = React.useState(false);

  const defaultEmoji = "🍽️";
  const displayEmoji = editableData.emoji ?? recipe?.emoji ?? defaultEmoji;

  const handleEmojiClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEmojiDialogOpen(true);
  };

  const handleEmojiSave = (newEmoji: string) => {
    saveChanges({ emoji: newEmoji });
    setIsEmojiDialogOpen(false);
  };

  const handleEmojiDialogClose = () => {
    setIsEmojiDialogOpen(false);
  };

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
    <>
      <ScaleOnHover
        className={styles.emojiMainContainer}
        scale={1.02}
        onClick={handleEmojiClick}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.emojiContainer}>
          <Text className={styles.emoji} aria-hidden="true">
            {displayEmoji}
          </Text>
        </div>
      </ScaleOnHover>
      {isEmojiDialogOpen && (
        <ChangeEmojiDialog
          isOpen={isEmojiDialogOpen}
          currentEmoji={displayEmoji}
          onSave={handleEmojiSave}
          onClose={handleEmojiDialogClose}
        />
      )}
    </>
  );
};

export const RecipeImage = React.memo(RecipeImageComponent);
