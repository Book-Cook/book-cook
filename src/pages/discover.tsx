import * as React from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

import discoverStyles from "./discover.module.css";
import { Button } from "../components/Button";
import {
  Dropdown,
  DropdownCaret,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "../components/Dropdown";
import { RecipeCard } from "../components/RecipeCard";
import galleryStyles from "../components/RecipeGallery/RecipeGallery.module.css";
import { SearchBox } from "../components/SearchBox";
import { Text, Heading1 } from "../components/Text";

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
  data: string;
  isPublic: boolean;
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

  const sortLabelMap: Record<string, string> = {
    createdAt: "Newest",
    savedCount: "Most Saved",
    viewCount: "Most Viewed",
    title: "Title",
  };

  return (
    <div className={galleryStyles.pageContainer}>
      <div className={galleryStyles.header}>
        <div className={galleryStyles.titleSection}>
          <Heading1>Discover Recipes</Heading1>
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
            onChange={(_, value) => setSearch(value)}
            contentBefore={<MagnifyingGlassIcon />}
          />
        </div>

        <div className={discoverStyles.filterRow}>
          <div className={discoverStyles.filterItem}>
            <Dropdown
              value={sortBy}
              onValueChange={(val) => setSortBy(val)}
              defaultValue="createdAt"
            >
              <DropdownTrigger fullWidth>
                <DropdownValue placeholder="Sort by">
                  {sortLabelMap[sortBy]}
                </DropdownValue>
                <DropdownCaret />
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem value="createdAt">Newest</DropdownItem>
                <DropdownItem value="savedCount">Most Saved</DropdownItem>
                <DropdownItem value="viewCount">Most Viewed</DropdownItem>
                <DropdownItem value="title">Title</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>

          <Button
            variant="ghost"
            icon={<FunnelIcon />}
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
                size="sm"
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
        <div className={galleryStyles.grid}>
          {recipes.map((recipe, index) => (
            <div
              key={recipe._id}
              className={`${galleryStyles.fadeIn} ${galleryStyles.cardWrapper}`}
              style={
                {
                  "--fadeInDelay": `${Math.min(index * 0.1, 0.3)}s`,
                } as React.CSSProperties
              }
            >
              <RecipeCard
                recipe={recipe}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
