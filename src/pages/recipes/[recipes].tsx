import { useRouter } from "next/router";
import { MarkdownParser, FallbackScreen, Display } from "../../components";
import { tokens, Tag, Divider, Text } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipe } from "../../server";
import * as React from "react";
import Image from "next/image";

export default function Recipes() {
  const router = useRouter();
  const { recipes } = router.query;

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
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
          maxWidth: "840px",
          marginBottom: "100px",
          backgroundColor: tokens.colorNeutralBackground2,
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          gap: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            borderRadius: "8px",
            // boxShadow: tokens.shadow8,
            overflow: "hidden",
          }}
        >
          {recipe?.imageURL && (
            <div
              style={{
                flex: "1 1 50%",
                minWidth: "300px",
                position: "relative",
                height: "250px",
              }}
            >
              <Image
                src={recipe.imageURL}
                alt={recipe.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 600px) 100vw, 50vw"
              />
            </div>
          )}
          <div
            style={{
              flex: "1 1 50%",
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "16px",
              boxSizing: "border-box",
            }}
          >
            <Display style={{ margin: 0 }}>{recipe?.title}</Display>
            {recipe?.createdAt && (
              <Text italic>
                {new Date(recipe.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {recipe?.tags?.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "#eee",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "0.875rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <FallbackScreen
            isLoading={isLoading}
            isError={Boolean(error)}
            dataLength={recipe?.data.length}
          >
            {recipe?.data && <MarkdownParser markdownInput={recipe.data} />}
          </FallbackScreen>
        </div>
      </div>
    </div>
  );
}
