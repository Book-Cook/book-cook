import * as React from "react";
import { 
  Title3, 
  Text, 
  Button,
  Dropdown,
  Option,
  makeStyles,
  tokens,
  SearchBox,
} from "@fluentui/react-components";
import { Search24Regular, Filter24Regular } from "@fluentui/react-icons";
import { useQuery } from "@tanstack/react-query";

import { RecipeCard } from "../components/RecipeCard";
import { useStyles } from "../components/RecipeGallery/RecipeGallery.styles";

interface PublicRecipe {
  _id: string;
  title: string;
  tags: string[];
  createdAt: string;
  emoji: string;
  imageURL: string;
  savedCount: number;
  viewCount: number;
  creatorName: string;
  owner: string;
}

interface PublicRecipesResponse {
  recipes: PublicRecipe[];
  totalCount: number;
  hasMore: boolean;
}

const useDiscoverStyles = makeStyles({
  searchAndFilters: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalXL,
  },
  searchRow: {
    display: "flex",
    gap: tokens.spacingHorizontalM,
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchBox: {
    flexGrow: 1,
    minWidth: "300px",
  },
  filterRow: {
    display: "flex",
    gap: tokens.spacingHorizontalM,
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterItem: {
    minWidth: "150px",
  },
  emptyState: {
    textAlign: "center",
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground2,
  },
});

const fetchPublicRecipes = async (params: {
  search?: string;
  tags?: string[];
  sortProperty?: string;
  sortDirection?: string;
  offset?: number;
  limit?: number;
}): Promise<PublicRecipesResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.search) {searchParams.append("search", params.search);}
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach(tag => searchParams.append("tags", tag));
  }
  if (params.sortProperty) {searchParams.append("sortProperty", params.sortProperty);}
  if (params.sortDirection) {searchParams.append("sortDirection", params.sortDirection);}
  if (params.offset) {searchParams.append("offset", params.offset.toString());}
  if (params.limit) {searchParams.append("limit", params.limit.toString());}

  const response = await fetch(`/api/recipes/public?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch public recipes");
  }
  
  return response.json();
};

export default function DiscoverPage() {
  const [search, setSearch] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortDirection, setSortDirection] = React.useState("desc");

  const { data: recipesData, isLoading, error } = useQuery({
    queryKey: ["publicRecipes", search, selectedTags, sortBy, sortDirection],
    queryFn: () => fetchPublicRecipes({
      search: search || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      sortProperty: sortBy,
      sortDirection,
      offset: 0,
      limit: 20,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const styles = useStyles();
  const discoverStyles = useDiscoverStyles();

  const recipes = recipesData?.recipes ?? [];

  // Common tags for filtering (could be fetched from API in the future)
  const availableTags = [
    "breakfast", "lunch", "dinner", "dessert", "snack",
    "vegetarian", "vegan", "gluten-free", "healthy",
    "quick", "easy", "comfort-food", "italian", "mexican", "asian"
  ];

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Title3 as="h1">Discover Recipes</Title3>
            <Text
              size={200}
              weight="medium"
              style={{ color: "var(--colorNeutralForeground2)" }}
            >
              {recipes.length > 0 
                ? `${recipes.length} recipes found${recipesData?.hasMore ? " (showing first 20)" : ""}`
                : "Find amazing recipes from the community"
              }
            </Text>
          </div>
        </div>

        <div className={discoverStyles.searchAndFilters}>
          <div className={discoverStyles.searchRow}>
            <SearchBox
              className={discoverStyles.searchBox}
              placeholder="Search recipes, ingredients, or creators..."
              value={search}
              onChange={(_, data) => setSearch(data.value)}
              contentBefore={<Search24Regular />}
            />
          </div>

          <div className={discoverStyles.filterRow}>
            <Dropdown
              className={discoverStyles.filterItem}
              placeholder="Sort by"
              value={sortBy === "createdAt" ? "Newest" : 
                    sortBy === "savedCount" ? "Most Saved" : 
                    sortBy === "viewCount" ? "Most Viewed" : "Title"}
              onOptionSelect={(_, data) => {
                const value = data.optionValue as string;
                setSortBy(value === "Newest" ? "createdAt" : 
                         value === "Most Saved" ? "savedCount" :
                         value === "Most Viewed" ? "viewCount" : "title");
              }}
            >
              <Option value="Newest">Newest</Option>
              <Option value="Most Saved">Most Saved</Option>
              <Option value="Most Viewed">Most Viewed</Option>
              <Option value="Title">Title</Option>
            </Dropdown>

            <Button
              appearance="subtle"
              icon={<Filter24Regular />}
              onClick={() => {
                // Toggle between asc/desc
                setSortDirection(prev => prev === "desc" ? "asc" : "desc");
              }}
            >
              {sortDirection === "desc" ? "Newest First" : "Oldest First"}
            </Button>
          </div>

          {availableTags.length > 0 && (
            <div className={discoverStyles.filterRow}>
              <Text size={200} weight="medium">Filter by tags:</Text>
              {availableTags.slice(0, 8).map(tag => (
                <Button
                  key={tag}
                  size="small"
                  appearance={selectedTags.includes(tag) ? "primary" : "subtle"}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className={discoverStyles.emptyState}>
            <Text>Loading recipes...</Text>
          </div>
        ) : error ? (
          <div className={discoverStyles.emptyState}>
            <Text>Failed to load recipes. Please try again.</Text>
          </div>
        ) : recipes.length === 0 ? (
          <div className={discoverStyles.emptyState}>
            <Text>No recipes found. Try adjusting your search or filters.</Text>
          </div>
        ) : (
          <div className={styles.grid}>
            {recipes.map((recipe, index) => (
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
                  title={recipe.title}
                  id={recipe._id}
                  emoji={recipe.emoji || "🍽️"}
                  imageSrc={recipe.imageURL}
                  tags={recipe.tags}
                  createdDate={recipe.createdAt}
                  isPublic={true}
                  creatorName={recipe.creatorName}
                  savedCount={recipe.savedCount}
                  showActions={false}
                />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}