import * as React from "react";
import { Text, SearchBox, makeStyles, tokens, Spinner } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";

import { RecipeDragCard } from "../RecipeDragCard/RecipeDragCard";

import { fetchAllRecipes } from "../../../clientToServer/fetch/fetchAllRecipes";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  searchBox: {
    width: "100%",
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: tokens.spacingVerticalS,
  },
  recipeList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  loadingState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacingVerticalXXL,
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  emptyState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacingVerticalXXL,
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
  },
});

export const MealPlanSidebar: React.FC = () => {
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch user's recipes
  const { data: recipes = [], isLoading, error } = useQuery({
    queryKey: ["recipes", debouncedSearch],
    queryFn: () => fetchAllRecipes(debouncedSearch, "dateNewest", []),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter recipes based on search
  const filteredRecipes = React.useMemo(() => {
    if (!debouncedSearch.trim()) {return recipes;}
    
    const query = debouncedSearch.toLowerCase();
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(query) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [recipes, debouncedSearch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchBox
          className={styles.searchBox}
          placeholder="Search recipes to add..."
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
        />
      </div>
      
      <div className={styles.content}>
        {isLoading && (
          <div className={styles.loadingState}>
            <Spinner size="medium" />
            <Text>Loading recipes...</Text>
          </div>
        )}
        
        {error && (
          <div className={styles.emptyState}>
            <Text>Failed to load recipes</Text>
            <Text size={200}>Please try again</Text>
          </div>
        )}
        
        {!isLoading && !error && filteredRecipes.length === 0 && (
          <div className={styles.emptyState}>
            <Text>No recipes found</Text>
            <Text size={200}>
              {searchQuery 
                ? "Try a different search term" 
                : "Start by creating some recipes!"
              }
            </Text>
          </div>
        )}
        
        {!isLoading && !error && filteredRecipes.length > 0 && (
          <div className={styles.recipeList}>
            {filteredRecipes.map(recipe => (
              <RecipeDragCard
                key={recipe._id}
                id={recipe._id}
                title={recipe.title}
                emoji={recipe.emoji}
                tags={recipe.tags}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};