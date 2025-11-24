import * as React from "react";
import { Button } from "../../Button";
import { Add24Regular } from "@fluentui/react-icons";

import { useNewRecipeButtonStyles } from "./NewRecipeButton.styles";

const NewRecipeButtonComponent = (props: { onClick: () => void }) => {
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

export const NewRecipeButton = React.memo(NewRecipeButtonComponent);
