import * as React from "react";
import { Button } from "@fluentui/react-components";
import { Add24Regular } from "@fluentui/react-icons";
import { useNewRecipeButtonStyles } from "./NewRecipeButton.styles";

export const NewRecipeButton = (props: { onClick: () => void }) => {
  const { onClick } = props;
  const styles = useNewRecipeButtonStyles();

  return (
    <Button
      appearance="primary"
      icon={<Add24Regular />}
      onClick={onClick}
      className={styles.toolbarButton}
    >
      New Recipe
    </Button>
  );
};
