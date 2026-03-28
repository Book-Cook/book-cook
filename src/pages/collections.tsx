import * as React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";

import { fetchRecipeCollections } from "src/clientToServer";
import type { Recipe } from "src/clientToServer";
import { RecipeCard } from "../components/RecipeCard";
import { useStyles } from "../components/RecipeGallery/RecipeGallery.styles";
import { Text, Heading1, Heading2 } from "../components/Text";
import { RecipeProvider } from "../context/RecipeProvider/RecipeProvider";

const useCollectionStyles = makeStyles({
  section: {
    marginBottom: tokens.spacingVerticalXXL,
  },
  sectionHeader: {
    marginBottom: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export default function CollectionsPage() {
  const { data: favoriteRecipes } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchRecipeCollections(),
  });

  const { data: savedRecipes } = useQuery<Recipe[]>({
    queryKey: ["savedRecipes"],
    queryFn: async () => {
      const response = await fetch("/api/user/saved-recipes");
      if (!response.ok) {throw new Error("Failed to fetch saved recipes");}
      return response.json();
    },
  });

  const styles = useStyles();
  const collectionStyles = useCollectionStyles();

  const totalRecipes = (favoriteRecipes?.length ?? 0) + (savedRecipes?.length ?? 0);

  return (
    <RecipeProvider>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Heading1>Collections</Heading1>
            <Text
              size={200}
              weight="medium"
              style={{ color: "var(--colorNeutralForeground2)" }}
            >
              {totalRecipes} recipes in your collections
            </Text>
          </div>
        </div>

        {/* My Favorite Recipes Section */}
        {favoriteRecipes && favoriteRecipes.length > 0 && (
          <div className={collectionStyles.section}>
            <div className={collectionStyles.sectionHeader}>
              <Heading2>My Favorite Recipes</Heading2>
              <Text size={200} style={{ color: "var(--colorNeutralForeground2)" }}>
                {favoriteRecipes.length} recipes from your own cookbook
              </Text>
            </div>
            <div className={styles.grid}>
              {favoriteRecipes.map((recipe, index) => (
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
                    isPublic={recipe?.isPublic}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Recipes Section */}
        {savedRecipes && savedRecipes.length > 0 && (
          <div className={collectionStyles.section}>
            <div className={collectionStyles.sectionHeader}>
              <Heading2>Saved from Community</Heading2>
              <Text size={200} style={{ color: "var(--colorNeutralForeground2)" }}>
                {savedRecipes.length} recipes saved from other creators
              </Text>
            </div>
            <div className={styles.grid}>
              {savedRecipes.map((recipe, index) => (
                <div
                  key={recipe._id}
                  className={`${styles.fadeIn} ${styles.cardWrapper}`}
                  style={
                    {
                      "--fadeInDelay": `${Math.min((favoriteRecipes?.length ?? 0) + index * 0.1, 0.5)}s`,
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
                    isPublic={true}
                    creatorName={recipe.creatorName}
                    savedCount={0}
                    showActions={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalRecipes === 0 && (
          <div className={styles.emptyState}>
            <Text size={400} weight="medium" style={{ marginBottom: "8px" }}>
              No recipes in your collection yet
            </Text>
            <Text size={300} style={{ color: "var(--colorNeutralForeground2)" }}>
              Heart your own recipes or save recipes from the community!
            </Text>
          </div>
        )}
      </div>
    </RecipeProvider>
  );
}
