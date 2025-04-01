import * as React from "react";
import { Input } from "@fluentui/react-components";
import { motion } from "framer-motion";
import { AddRegular } from "@fluentui/react-icons";
import { useRecipe } from "../../../context";
import { useStyles } from "./RecipeTags.styles";

export const RecipeTags = () => {
  const styles = useStyles();
  const { recipe, editableData, handleAddTag, handleRemoveTag } = useRecipe();
  const [newTag, setNewTag] = React.useState("");

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault();
      handleAddTag(newTag);
      setNewTag("");
    }
  };

  const onAddTag = () => {
    handleAddTag(newTag);
    setNewTag("");
  };

  // TODO
  const isEditing = false;

  return recipe && recipe?.tags?.length > 0 ? (
    <div className={styles.tagsContainer}>
      {isEditing ? (
        <>
          {editableData.tags.map((tag, index) => (
            <motion.span
              key={`${tag}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className={styles.tag}
              onClick={() => handleRemoveTag(tag)}
              style={{ cursor: "pointer" }}
            >
              {tag} ✕
            </motion.span>
          ))}
          <div className={styles.tagInputContainer}>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className={styles.tagInput}
              placeholder="Add tag..."
              onKeyDown={handleTagKeyPress}
            />
            <motion.div
              className={styles.addTagButton}
              onClick={onAddTag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AddRegular />
            </motion.div>
          </div>
        </>
      ) : (
        recipe?.tags?.map((tag: string, index: number) => (
          <div key={`${tag}-${index}`} className={styles.tag}>
            {tag}
          </div>
        ))
      )}
    </div>
  ) : null;
};
