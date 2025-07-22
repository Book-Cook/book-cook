import * as React from "react";
import { Text, Title3, Dropdown, Option } from "@fluentui/react-components";
import type {
  SelectionEvents,
  OptionOnSelectData,
} from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";

import { fetchAllRecipes } from "src/clientToServer/fetch/fetchAllRecipes";
import { FallbackScreen } from "../FallbackScreens/FallbackScreen";
import { RecipeCard } from "../RecipeCard";
import { useStyles } from "../RecipeGallery/RecipeGallery.styles";
import { TagPicker } from "../TagPicker/TagPicker";
import { SearchBar } from "../Toolbar/SearchBar";

import { useSearchBox } from "../../context";

export const MyRecipesTab = () => {
  const styles = useStyles();
  const { searchBoxValue } = useSearchBox();
  
  const [sortOption, setSortOption] = React.useState("dateNewest");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = React.useState(false);

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes", searchBoxValue, sortOption, selectedTags],
    queryFn: () => fetchAllRecipes(searchBoxValue, sortOption, selectedTags),
  });

  // Extract unique tags from recipes
  React.useEffect(() => {
    if (recipes?.length) {
      const uniqueTags = Array.from(
        new Set(recipes.flatMap((recipe) => recipe.tags || []))
      );
      setAvailableTags(uniqueTags);
    }
  }, [recipes]);

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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Title3 as="h1">Your Recipes</Title3>
          <Text
            size={200}
            weight="medium"
            style={{ color: "var(--colorNeutralForeground2)" }}
          >
            {recipes?.length} recipes{" "}
            {searchBoxValue
              ? `matching "${searchBoxValue}"`
              : "in your collection"}
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
            defaultSelectedOptions={["dateNewest"]}
            defaultValue={"Sort by date (newest)"}
          >
            <Option value={"dateNewest"}>Sort by date (newest)</Option>
            <Option value={"dateOldest"}>Sort by date (oldest)</Option>
            <Option value={"ascTitle"}>Sort by title (asc)</Option>
            <Option value={"descTitle"}>Sort by title (desc)</Option>
          </Dropdown>
          <TagPicker
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>
      </div>
      <FallbackScreen
        isLoading={showLoadingIndicator}
        isError={Boolean(error)}
        dataLength={recipes?.length}
      >
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
                    new Date(recipe?.createdAt).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  }
                  imageSrc={recipe?.imageURL}
                  tags={recipe?.tags}
                  isPublic={recipe?.isPublic}
                />
              </div>
            );
          })}
        </div>
      </FallbackScreen>
    </div>
  );
};