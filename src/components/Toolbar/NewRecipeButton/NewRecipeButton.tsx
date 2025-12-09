import * as React from "react";
import { Add24Regular } from "@fluentui/react-icons";

import styles from "./NewRecipeButton.module.css";
import type { NewRecipeButtonProps } from "./NewRecipeButton.types";
import { Button } from "../../Button";

export const NewRecipeButton: React.FC<NewRecipeButtonProps> = ({ onClick }) => {
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
