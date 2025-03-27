import * as React from "react";
import {
  Display,
  Text,
  Button,
  Tooltip,
  Input,
} from "@fluentui/react-components";
import { motion } from "framer-motion";
import {
  CheckmarkRegular,
  DismissRegular,
  EditRegular,
  DeleteRegular,
} from "@fluentui/react-icons";
import { useRecipe } from "../../../context";
import { useStyles } from "./RecipeHeader.styles";

const EditActions = ({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) => (
  <>
    <Tooltip content="Save changes" relationship="label">
      <Button
        icon={<CheckmarkRegular />}
        appearance="primary"
        onClick={onSave}
        aria-label="Save changes"
      />
    </Tooltip>
    <Tooltip content="Cancel editing" relationship="label">
      <Button
        icon={<DismissRegular />}
        appearance="subtle"
        onClick={onCancel}
        aria-label="Cancel editing"
      />
    </Tooltip>
  </>
);

const ViewActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <>
    <Tooltip content="Edit recipe" relationship="label">
      <Button
        icon={<EditRegular />}
        appearance="subtle"
        onClick={onEdit}
        aria-label="Edit recipe"
      />
    </Tooltip>
    <Tooltip content="Delete recipe" relationship="label">
      <Button
        icon={<DeleteRegular />}
        appearance="subtle"
        onClick={onDelete}
        aria-label="Delete recipe"
      />
    </Tooltip>
  </>
);

export const RecipeHeader = () => {
  const styles = useStyles();
  const {
    recipe,
    isEditing,
    setIsEditing,
    editableData,
    updateEditableData,
    saveChanges,
    cancelEditing,
    deleteRecipe,
  } = useRecipe();

  const formattedDate = React.useMemo(() => {
    try {
      return recipe?.createdAt
        ? new Date(recipe.createdAt).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : null;
    } catch {
      return null;
    }
  }, [recipe?.createdAt]);

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={styles.headerSection}
    >
      <div className={styles.titleRow}>
        <div className={styles.titleContainer}>
          {isEditing ? (
            <Input
              aria-label="Recipe title"
              placeholder="Recipe title"
              value={editableData.title}
              onChange={(e) => updateEditableData("title", e.target.value)}
              className={styles.titleInput}
              size="large" // Use Fluent's sizing for visual weight
              appearance="underline" // Example: Using a built-in modern appearance
            />
          ) : (
            <Display as="h1" className={styles.title}>
              {recipe?.title}
            </Display>
          )}
        </div>

        <div className={styles.actionButtons}>
          {isEditing ? (
            <EditActions onSave={saveChanges} onCancel={cancelEditing} />
          ) : (
            <ViewActions
              onEdit={() => setIsEditing(true)}
              onDelete={deleteRecipe}
            />
          )}
        </div>
      </div>

      {formattedDate && !isEditing && (
        <Text italic className={styles.date}>
          Created: {formattedDate}
        </Text>
      )}
    </motion.div>
  );
};
