import * as React from "react";
import { Add24Regular } from "@fluentui/react-icons";

import { useNewRecipeButtonStyles } from "./NewRecipeButton.styles";

import { Button } from "../../Button";

export const NewRecipeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
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
