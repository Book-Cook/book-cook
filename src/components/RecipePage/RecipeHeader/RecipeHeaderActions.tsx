import * as React from "react";
import { Button, Tooltip } from "@fluentui/react-components";
import {
  DismissRegular,
  DeleteRegular,
  Heart20Regular,
  SaveRegular,
} from "@fluentui/react-icons";

import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useActionsStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  favoriteButton: {
    color: tokens.colorPaletteRedForeground1,
  },
});

export type RecipeHeaderActionsProps = {
  onSave: () => void;
  onCancel: () => void;
  onAddToCollection: () => void;
  onDelete: () => void;
  hasEdits: boolean;
};

export const RecipeHeaderActions: React.FC<RecipeHeaderActionsProps> = ({
  onSave,
  onCancel,
  onAddToCollection,
  onDelete,
  hasEdits,
}) => {
  const styles = useActionsStyles();

  return (
    <div className={styles.root}>
      {hasEdits ? (
        <>
          <Tooltip content="Save changes" relationship="label">
            <Button
              aria-label="Save changes"
              appearance="primary"
              icon={<SaveRegular />}
              shape="circular"
              onClick={onSave}
            />
          </Tooltip>
          <Tooltip content="Cancel editing" relationship="label">
            <Button
              aria-label="Cancel editing"
              appearance="subtle"
              icon={<DismissRegular />}
              shape="circular"
              onClick={onCancel}
            />
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip content="Add to Collection" relationship="label">
            <Button
              aria-label="Add to Collection"
              appearance="transparent"
              icon={<Heart20Regular />}
              shape="circular"
              onClick={onAddToCollection}
              className={styles.favoriteButton}
            />
          </Tooltip>
          <Tooltip content="Delete recipe" relationship="label">
            <Button
              aria-label="Delete recipe"
              appearance="subtle"
              icon={<DeleteRegular />}
              shape="circular"
              onClick={onDelete}
            />
          </Tooltip>
        </>
      )}
    </div>
  );
};
