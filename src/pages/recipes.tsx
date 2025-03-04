import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import { RecipeCard, FallbackScreen } from "../components";
import {
  Text,
  Title3,
  Dropdown,
  Option,
  useId,
} from "@fluentui/react-components";

import { useQuery } from "@tanstack/react-query";
import { fetchAllRecipes } from "src/clientToServer/fetch/fetchAllRecipes";
import { useSearchBox } from "../context";
import type {
  SelectionEvents,
  OptionOnSelectData,
} from "@fluentui/react-components";

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
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
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
    animationDuration: "0.3s",
    animationTimingFunction: "ease-out",
  },
});

export default function Home() {
  const styles = useStyles();
  const { searchBoxValue } = useSearchBox();

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes", searchBoxValue],
    queryFn: () => fetchAllRecipes(searchBoxValue, "desc"),
  });

  const onSortOptionSelect = (
    _ev: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    console.log(data.selectedOptions ?? "");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Title3 as="h1">Recipes</Title3>
          <Text
            size={200}
            weight="medium"
            style={{ color: "var(--colorNeutralForeground2)" }}
          >
            {recipes?.length} recipes{" "}
            {searchBoxValue
              ? `matching "${searchBoxValue}"`
              : "in your collection"}
          </Text>
        </div>
        <div className={styles.controls}>
          <Dropdown
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
        </div>
      </div>
      <FallbackScreen
        isLoading={isLoading}
        isError={Boolean(error)}
        dataLength={recipes?.length}
      >
        <div className={styles.grid}>
          {recipes?.map((recipe, index) => {
            return (
              <div
                key={recipe._id}
                className={`${styles.fadeIn} ${styles.cardWrapper}`}
                style={{
                  animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
                }}
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
