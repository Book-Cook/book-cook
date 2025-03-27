import * as React from "react";
import { Button } from "@fluentui/react-components";
import { Add24Regular } from "@fluentui/react-icons";
import { useRouter } from "next/router";
import { useNewRecipeButtonStyles } from "./NewRecipeButton.styles";

export const NewRecipeButton = () => {
  const router = useRouter();
  const styles = useNewRecipeButtonStyles();

  const handleNewRecipe = () => router.push("/newRecipe");

  return (
    <Button
      appearance="primary"
      icon={<Add24Regular />}
      onClick={handleNewRecipe}
      className={styles.toolbarButton}
    >
      New Recipe
    </Button>
  );
};
