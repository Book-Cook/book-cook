import * as React from "react";
import { useRouter } from "next/router";

import { useStyles } from "./RecipeTags.styles";

import { useRecipe } from "../../../context";

const RecipeTagsComponent = () => {
  const styles = useStyles();
  const { recipe } = useRecipe();
  const router = useRouter();

  const handleTagClick = async (tag: string) => {
    await router.push(`/recipes?tag=${encodeURIComponent(tag)}`);
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
          onKeyDown={async (e) => {
            if (e.key === "Enter" || e.key === " ") {
              await handleTagClick(tag);
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

export const RecipeTags = React.memo(RecipeTagsComponent);
