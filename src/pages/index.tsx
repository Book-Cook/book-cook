import * as React from "react";
import { RecipeCard } from "../components";
import { tokens } from "@fluentui/react-components";

import { useQuery } from "@tanstack/react-query";
import { fetchAllRecipes } from "src/server/queries/fetchAllRecipes";

export default function Home() {
  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: () => fetchAllRecipes(),
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
        {recipes?.map((recipe) => {
          return (
            <RecipeCard
              title={recipe?.title}
              id={recipe?._id}
              createdDate={recipe?.createdDate}
              imageSrc={recipe?.imageURL}
              tags={recipe?.tags}
            />
          );
        })}
        {/* <RecipeCard title="Cookies" />
        <RecipeCard title="Cookies" />
        <RecipeCard title="Cookies" />
        <RecipeCard title="Cookies" />
        <RecipeCard title="Cookies" />
        <RecipeCard title="Cookies" />
        <RecipeCard
          title="French Toast"
          id="66eb31c43c095a50cb2e60a2"
          createdDate="8/3/2024"
          imageSrc="https://www.tasteofhome.com/wp-content/uploads/2020/10/The-Best-French-Toast_EXPS_TOHFM21_256104_E09_24_9b.jpg"
          tags={["test"]}
        /> */}
      </div>
    </div>
  );
}
