import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Title3, Text } from "@fluentui/react-components";

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
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Title3 as="h1">Collections</Title3>
            <Text
              size={200}
              weight="medium"
              style={{ color: "var(--colorNeutralForeground2)" }}
            >
              {recipes?.length ?? 0} favorite recipes
            </Text>
          </div>
        </div>

        {recipes && recipes.length > 0 ? (
          <div className={styles.grid}>
            {recipes.map((recipe, index) => {
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
        ) : (
          <div className={styles.emptyState}>
            <Text size={400} weight="medium" style={{ marginBottom: "8px" }}>
              No recipes in your collection yet
            </Text>
            <Text size={300} style={{ color: "var(--colorNeutralForeground2)" }}>
              Heart a recipe to add it to your collection!
            </Text>
          </div>
        )}
      </div>
    </RecipeProvider>
  );
}
