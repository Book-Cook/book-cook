import * as React from "react";
import Image from "next/image";
import { ImageRegular } from "@fluentui/react-icons";
import { Text } from "@fluentui/react-components";
import { motion } from "framer-motion";
import { useRecipe } from "../../../context";
import { useStyles } from "./RecipeImage.styles";

export const RecipeImage = () => {
  const styles = useStyles();
  const { isEditing, recipe, editableData, handleImageUpload } = useRecipe();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  if (isEditing) {
    return (
      <div
        className={styles.imageUploadContainer}
        onClick={() => fileInputRef.current?.click()}
      >
        {editableData.imageURL ? (
          <div className={styles.imageContainer}>
            <Image
              src={editableData.imageURL}
              alt="Recipe preview"
              fill
              className={styles.recipeImage}
              sizes="(max-width: 840px) 100vw, 840px"
            />
          </div>
        ) : (
          <>
            <ImageRegular fontSize={48} />
            <Text>Click to upload an image</Text>
          </>
        )}
        <input
          title="Upload recipe image"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
    );
  }

  if (!recipe?.imageURL) return null;

  return (
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
  );
};
