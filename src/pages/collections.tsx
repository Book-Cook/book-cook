import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchRecipeCollections } from "src/clientToServer";
import { RecipeCard } from "../components/RecipeCard";
import { useStyles } from "../components/RecipeGallery/RecipeGallery.styles";
import { RecipeProvider } from "../context/RecipeProvider/RecipeProvider";

export default function CollectionsPage() {
  const { data: recipes } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchRecipeCollections(),
  });

  const styles = useStyles();

  return (
    <RecipeProvider>
      <h1>Collections</h1>

      <div className={styles.grid}>
        {recipes?.map((recipe, index) => {
          return (
            <div
              key={recipe._id}
              className={`${styles.fadeIn} ${styles.cardWrapper}`}
              style={
                {
                  "--fadeInDelay": `${Math.min(index * 0.1, 0.3)}s`,
                } as React.CSSProperties
              }
            >
              <RecipeCard
                title={recipe?.title}
                id={recipe?._id}
                emoji={recipe?.emoji || ""}
                createdDate={
                  recipe?.createdAt &&
                  new Date(recipe?.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
                imageSrc={recipe?.imageURL}
                tags={recipe?.tags}
              />
            </div>
          );
        })}
      </div>
    </RecipeProvider>
  );
}
