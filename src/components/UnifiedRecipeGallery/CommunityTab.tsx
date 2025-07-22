import * as React from "react";
import { Text, Title3, Dropdown, Option } from "@fluentui/react-components";
import type {
  SelectionEvents,
  OptionOnSelectData,
} from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";

import { FallbackScreen } from "../FallbackScreens/FallbackScreen";
import { RecipeCard } from "../RecipeCard";
import { useStyles } from "../RecipeGallery/RecipeGallery.styles";
import { TagPicker } from "../TagPicker/TagPicker";
import { SearchBar } from "../Toolbar/SearchBar";

import { useSearchBox } from "../../context";

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

// Common tags for filtering
const availableTags = [
  "breakfast", "lunch", "dinner", "dessert", "snack",
  "vegetarian", "vegan", "gluten-free", "healthy",
  "quick", "easy", "comfort-food", "italian", "mexican", "asian"
];

export const CommunityTab = () => {
  const styles = useStyles();
  const { searchBoxValue } = useSearchBox();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [sortOption, setSortOption] = React.useState("createdAt_desc");
  const [showLoadingIndicator, setShowLoadingIndicator] = React.useState(false);

  const { data: recipesData, isLoading, error } = useQuery({
    queryKey: ["publicRecipes", searchBoxValue, selectedTags, sortOption],
    queryFn: () => {
      const [sortProperty, sortDirection] = sortOption.split("_");
      return fetchPublicRecipes({
        search: searchBoxValue || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        sortProperty,
        sortDirection,
        offset: 0,
        limit: 20,
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const recipes = recipesData?.recipes ?? [];

  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      timer = setTimeout(() => {
        setShowLoadingIndicator(true);
      }, 300);
    } else {
      setShowLoadingIndicator(false);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  const onSortOptionSelect = (
    _ev: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    if (data.selectedOptions?.[0]) {
      setSortOption(data.selectedOptions[0]);
    }
  };

  const getSortDisplayValue = (option: string) => {
    switch (option) {
      case "createdAt_desc": return "Sort by date (newest)";
      case "createdAt_asc": return "Sort by date (oldest)";
      case "savedCount_desc": return "Sort by popularity";
      case "viewCount_desc": return "Sort by views";
      case "title_asc": return "Sort by title (A-Z)";
      case "title_desc": return "Sort by title (Z-A)";
      default: return "Sort by date (newest)";
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Title3 as="h1">Community Recipes</Title3>
          <Text
            size={200}
            weight="medium"
            style={{ color: "var(--colorNeutralForeground2)" }}
          >
            {recipes.length > 0 
              ? `${recipes.length} recipes found${recipesData?.hasMore ? " (showing first 20)" : ""}`
              : "Find amazing recipes from the community"
            }
            {searchBoxValue && ` matching "${searchBoxValue}"`}
            {selectedTags.length > 0 &&
              ` with tags: ${selectedTags.join(", ")}`}
          </Text>
        </div>
        <div className={styles.controlsRow}>
          <div className={styles.searchWrapper}>
            <SearchBar targetPage="/recipes" />
          </div>
          <Dropdown
            className={styles.sortDropdown}
            appearance="outline"
            onOptionSelect={onSortOptionSelect}
            defaultSelectedOptions={["createdAt_desc"]}
            value={getSortDisplayValue(sortOption)}
          >
            <Option value="createdAt_desc">Sort by date (newest)</Option>
            <Option value="createdAt_asc">Sort by date (oldest)</Option>
            <Option value="savedCount_desc">Sort by popularity</Option>
            <Option value="viewCount_desc">Sort by views</Option>
            <Option value="title_asc">Sort by title (A-Z)</Option>
            <Option value="title_desc">Sort by title (Z-A)</Option>
          </Dropdown>
          <TagPicker
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            placeholder="Filter by tags"
          />
        </div>
      </div>
      <FallbackScreen
        isLoading={showLoadingIndicator}
        isError={Boolean(error)}
        dataLength={recipes?.length}
      >
        <div className={styles.grid}>
          {recipes?.map((recipe, index) => (
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
      </FallbackScreen>
    </div>
  );
};