import * as React from "react";
import { RecipeCard, FallbackScreen } from "../components";
import { tokens } from "@fluentui/react-components";

import { useQuery } from "@tanstack/react-query";
import { fetchAllRecipes } from "src/server/queries/fetchAllRecipes";
import { useSearchBox } from "../context";

export default function Home() {
  const { searchBoxValue } = useSearchBox();

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes", searchBoxValue],
    queryFn: () => fetchAllRecipes(searchBoxValue),
  });

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
          isError={error}
          dataLength={recipes?.length}
        />
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
      </div>
    </div>
  );
}
