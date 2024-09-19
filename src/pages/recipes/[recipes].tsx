import { useRouter } from "next/router";
import { MarkdownParser, FallbackScreen } from "../../components";
import { tokens, Card, Spinner } from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipe } from "../../server";

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
          maxWidth: "700px",
          marginTop: "40px",
          marginBottom: "100px",
        }}
      >
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
  );
}
