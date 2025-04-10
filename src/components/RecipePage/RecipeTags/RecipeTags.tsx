import * as React from "react";
import { useRouter } from "next/router";

import { useStyles } from "./RecipeTags.styles";

import { useRecipe } from "../../../context";

export const RecipeTags = () => {
  const styles = useStyles();
  const { recipe } = useRecipe();
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    router.push(`/recipes?tag=${encodeURIComponent(tag)}`);
  };

  return recipe && recipe?.tags?.length > 0 ? (
    <div className={styles.tagsContainer}>
      {recipe?.tags?.map((tag: string, index: number) => (
        <div
          key={`${tag}-${index}`}
          className={styles.tag}
          onClick={() => handleTagClick(tag)}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleTagClick(tag);
              e.preventDefault();
            }
          }}
        >
          {tag}
        </div>
      ))}
    </div>
  ) : null;
};
