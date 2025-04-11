import * as React from "react";
import { Text } from "@fluentui/react-components";
import { PersonRegular } from "@fluentui/react-icons";

import { useStyles } from "./RecipeAuthor.styles";

import { useRecipe } from "../../../context";

export const RecipeAuthor: React.FC = () => {
  const styles = useStyles();
  const { recipe } = useRecipe();

  return recipe?.owner ? (
    <div className={styles.authorContainer}>
      <PersonRegular className={styles.authorIcon} />
      <Text className={styles.authorText}>By {recipe?.owner}</Text>
    </div>
  ) : null;
};
