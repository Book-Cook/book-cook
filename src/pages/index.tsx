import * as React from "react";
import { RecipeCard } from "../components";
import { tokens } from "@fluentui/react-components";

import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        backgroundColor: tokens.colorNeutralBackground2,
      }}
    >
      <div
        style={{
          width: "100%",
          marginTop: "40px",
          marginBottom: "100px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "60px",
          alignItems: "start",
        }}
      >
        <RecipeCard title="Cookies" />
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
        />
      </div>
    </div>
  );
}
