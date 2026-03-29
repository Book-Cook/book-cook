import * as React from "react";
import {
  Button,
  Tooltip,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import { SaveRegular, DismissRegular } from "@fluentui/react-icons";

export const useRecipeHeaderSaveBarStyles = makeStyles({
  root: {
    position: "fixed",
    bottom: tokens.spacingVerticalXXL,
    right: tokens.spacingHorizontalXXL,
    display: "flex",
    zIndex: 1000,
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingHorizontalS, tokens.spacingHorizontalM),
    boxShadow: tokens.shadow16,
  },
});

export type RecipeHeaderSaveBarProps = {
  hasEdits: boolean;
  onSave: () => void;
  onCancel: () => void;
};

const RecipeHeaderSaveBarComponent: React.FC<RecipeHeaderSaveBarProps> = ({
  hasEdits,
  onSave,
  onCancel,
}) => {
  const styles = useRecipeHeaderSaveBarStyles();

  if (!hasEdits) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Tooltip content="Discard changes" relationship="label">
        <Button
          aria-label="Discard changes"
          appearance="subtle"
          icon={<DismissRegular />}
          onClick={onCancel}
        />
      </Tooltip>
      <Tooltip content="Save changes" relationship="label">
        <Button
          aria-label="Save changes"
          appearance="primary"
          icon={<SaveRegular />}
          onClick={onSave}
        />
      </Tooltip>
    </div>
  );
};

export const RecipeHeaderSaveBar = React.memo(RecipeHeaderSaveBarComponent);
