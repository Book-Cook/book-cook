import * as React from "react";

import { PersonRegular } from "@fluentui/react-icons";

import { useStyles } from "./RecipeAuthor.styles";

import { useFetchUser } from "../../../clientToServer/fetch/useFetchUser";
import { useRecipe } from "../../../context";

import { Text } from "../../Text";

const RecipeAuthorComponent: React.FC = () => {
  const styles = useStyles();
  const { recipe } = useRecipe();
  const { user } = useFetchUser(recipe?.owner ?? "");

  return recipe?.owner ? (
    <div className={styles.authorContainer}>
      <PersonRegular className={styles.authorIcon} />
      <Text className={styles.authorText}>By {user?.name}</Text>
    </div>
  ) : null;
};

export const RecipeAuthor = React.memo(RecipeAuthorComponent);
