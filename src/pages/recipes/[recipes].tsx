import { useRouter } from "next/router";
import { MarkdownParser, FallbackScreen } from "../../components";
import { tokens, Card, Spinner, Divider } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipe } from "../../server";
import * as React from "react";
import Image from "next/image";

export default function Recipes() {
  const router = useRouter();
  const { recipes } = router.query;

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", recipes],
    queryFn: () => fetchRecipe(recipes as string),
  });

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
          maxWidth: "740px",
          marginBottom: "100px",
          backgroundColor: tokens.colorNeutralBackground3,
          border: `1px solid ${tokens.colorNeutralStroke2}`,
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          gap: "50px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            maxWidth: "300px",
            height: "250px",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: tokens.shadow8,
            flexDirection: "row",
          }}
        >
          {recipe?.imageURL && (
            <Image
              src={recipe?.imageURL}
              alt={recipe?.title}
              objectFit="contain"
              fill
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <Divider />
        <div>
          {!isLoading ? (
            recipe?.data ? (
              <MarkdownParser markdownInput={recipe.data} />
            ) : (
              <FallbackScreen view="empty" />
            )
          ) : (
            <FallbackScreen view="loading" />
          )}
        </div>
      </div>
    </div>
  );
}
