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

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={styles.headerSection}
    >
      <div className={styles.titleRow}>
        {isEditing ? (
          <Input
            value={editableData.title}
            onChange={(e) => updateEditableData("title", e.target.value)}
            className={styles.titleInput}
            placeholder="Recipe title"
          />
        ) : (
          <Display as="h1" className={styles.title}>
            {recipe?.title}
          </Display>
        )}

        {isEditing ? (
          <div className={styles.actionButtons}>
            <Tooltip content="Save changes" relationship="label">
              <Button
                icon={<CheckmarkRegular />}
                appearance="primary"
                onClick={saveChanges}
              />
            </Tooltip>
            <Tooltip content="Cancel editing" relationship="label">
              <Button
                icon={<DismissRegular />}
                appearance="subtle"
                onClick={cancelEditing}
              />
            </Tooltip>
          </div>
        ) : (
          <div className={styles.actionButtons}>
            <Tooltip content="Edit recipe" relationship="label">
              <Button
                icon={<EditRegular />}
                appearance="subtle"
                onClick={() => setIsEditing(true)}
              />
            </Tooltip>
            <Tooltip content="Delete recipe" relationship="label">
              <Button
                icon={<DeleteRegular />}
                appearance="subtle"
                onClick={deleteRecipe}
              />
            </Tooltip>
          </div>
        )}
      </div>
      {recipe?.createdAt && !isEditing && (
        <Text size={200} italic className={styles.date}>
          {new Date(recipe.createdAt).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      )}
    </motion.div>
  );
};
