import * as React from "react";
import { useRouter } from "next/router";

/** Route removed -- recipe creation is now handled by NewRecipeDialog in the sidebar. */
export default function NewRecipe() {
  const router = useRouter();

  React.useEffect(() => {
    void router.push("/recipes");
  }, [router]);

  return null;
}
