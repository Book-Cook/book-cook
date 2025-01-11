import * as React from "react";
import { RecipeCard, FallbackScreen } from "../components";
import { tokens, Dropdown, Option, Label } from "@fluentui/react-components";

import { useQuery } from "@tanstack/react-query";
import { fetchAllRecipes } from "src/clientToServer/fetch/fetchAllRecipes";
import { useSearchBox } from "../context";
import type {
  SelectionEvents,
  OptionOnSelectData,
} from "@fluentui/react-components";

export default function Home() {
  const { searchBoxValue } = useSearchBox();

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes", searchBoxValue],
    queryFn: () => fetchAllRecipes(searchBoxValue, "createdAt", "desc"),
  });

  const onSortOptionSelect = (
    _ev: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    console.log(data.selectedOptions ?? "");
  };

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        backgroundColor: tokens.colorNeutralBackground2,
        justifyContent: "center",
        marginLeft: "32px",
        marginRight: "32px",
      }}
    >
      <div
        style={{
          padding: "12px",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {recipes?.length} recipes
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
      <div
        style={{
          width: "100%",
          marginTop: "40px",
          marginBottom: "100px",
          display: "grid",
          justifyContent: "center",
          gridTemplateColumns: "repeat(auto-fit, 268px)",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <FallbackScreen
          isLoading={isLoading}
          isError={Boolean(error)}
          dataLength={recipes?.length}
        >
          {recipes?.map((recipe) => {
            return (
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
            );
          })}
        </FallbackScreen>
      </div>
    </div>
  );
}
