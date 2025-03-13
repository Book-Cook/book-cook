import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import {
  RecipeCard,
  FallbackScreen,
  TagFilter,
  Unauthorized,
} from "../components";
import {
  Text,
  Title3,
  Dropdown,
  Option,
  tokens,
} from "@fluentui/react-components";

import { useQuery } from "@tanstack/react-query";
import { fetchAllRecipes } from "src/clientToServer/fetch/fetchAllRecipes";
import { useSearchBox } from "../context";
import type {
  SelectionEvents,
  OptionOnSelectData,
} from "@fluentui/react-components";
import { useSession } from "next-auth/react";

const useStyles = makeStyles({
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
    gap: "24px",
    ...shorthands.padding("0", "12px"),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "stretch",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "320px",
  },
  sortDropdown: {
    alignSelf: "flex-end",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
    width: "100%",
  },
  cardWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  fadeIn: {
    animationName: {
      from: { opacity: 0, transform: "translateY(8px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    animationDuration: ".3s",
    animationTimingFunction: "ease-out",
    animationFillMode: "both",
    animationDelay: "var(--fadeInDelay)",
  },
});

export default function Recipes() {
  const styles = useStyles();
  const { searchBoxValue } = useSearchBox();
  const { data: session, status } = useSession();

  const [sortOption, setSortOption] = React.useState("dateNewest");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = React.useState(false);

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes", searchBoxValue, sortOption],
    queryFn: () => fetchAllRecipes(searchBoxValue, sortOption),
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

  if (!session) {
    return <Unauthorized />;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Title3 as="h1">My Recipes</Title3>
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
        <div className={styles.controls}>
          <Dropdown
            className={styles.sortDropdown}
            appearance="underline"
            onOptionSelect={onSortOptionSelect}
            defaultSelectedOptions={["dateNewest"]}
            defaultValue={"Sort by date (newest)"}
          >
            <Option value={"dateNewest"}>Sort by date (newest)</Option>
            <Option value={"dateOldest"}>Sort by date (oldest)</Option>
            <Option value={"ascTitle"}>Sort by title (asc)</Option>
            <Option value={"descTitle"}>Sort by title (desc)</Option>
          </Dropdown>
          {/* <TagFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          /> */}
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
      </FallbackScreen>
    </div>
  );
}
