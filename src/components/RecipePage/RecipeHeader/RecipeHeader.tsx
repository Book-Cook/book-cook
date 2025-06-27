import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Button,
  Tooltip,
  Text,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  Toaster,
  useId,
} from "@fluentui/react-components";
import {
  Heart20Regular,
  Heart20Filled,
  SparkleRegular,
} from "@fluentui/react-icons";

import { useHeaderStyles } from "./RecipeHeader.styles";
import { RecipeHeaderSaveBar } from "./RecipeHeaderSaveBar";
import { RecipeAuthor } from "../RecipeAuthor/RecipeAuthor";
import { StarRating } from "../../StarRating";

import {
  useConvertMeasurements,
  fetchRecipeCollections,
} from "../../../clientToServer";
import type { Recipe } from "../../../clientToServer";
import { useRecipe } from "../../../context";
import { FadeIn } from "../../Animation";
import { RecipeActions } from "../../RecipeActions";

export const RecipeHeader = () => {
  const styles = useHeaderStyles();
  const {
    recipe,
    editableData,
    updateEditableDataKey,
    saveChanges,
    cancelEditing,
    hasEdits,
    onAddToCollection,
  } = useRecipe();

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const { data: session } = useSession();
  const { data: collections } = useQuery<Recipe[]>({
    queryKey: ["collections"],
    queryFn: () => fetchRecipeCollections(),
    enabled: Boolean(session),
  });

  const isLiked = useMemo(() => {
    if (!collections || !recipe?._id) {
      return false;
    }
    return collections.some((r) => r._id === recipe._id);
  }, [collections, recipe?._id]);

  const {
    mutate: convertRecipeContent,
    isPending: isConverting,
    reset: resetConversionState,
  } = useConvertMeasurements();

  const formattedDate = useMemo(() => {
    const date = recipe?.createdAt ? new Date(recipe.createdAt) : null;
    if (!date || isNaN(date.getTime())) {
      return null;
    }
    try {
      return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [recipe?.createdAt]);

  const handleAddToCollection = () =>
    recipe?._id && onAddToCollection(recipe._id);

  const handleAiConvert = () => {
    if (isConverting || !editableData?.content) {
      return;
    }

    resetConversionState();

    dispatchToast(
      <Toast>
        <ToastTitle>AI Processing</ToastTitle>
        <ToastBody>Converting recipe measurements...</ToastBody>
      </Toast>,
      { position: "top-end", timeout: 2000 }
    );

    convertRecipeContent(
      { htmlContent: editableData.content },
      {
        onSuccess: (data) => {
          updateEditableDataKey("content", data.processedContent);

          dispatchToast(
            <Toast>
              <ToastTitle>Success!</ToastTitle>
            </Toast>,
            { position: "top-end", intent: "success", timeout: 1000 }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Error</ToastTitle>
              <ToastBody>
                Failed to convert measurements. Please try again.
              </ToastBody>
            </Toast>,
            { position: "top-end", intent: "error", timeout: 1000 }
          );
        },
      }
    );
  };

  return (
    <>
      <Toaster toasterId={toasterId} />
      <FadeIn up delay={0.4} className={styles.headerSection}>
        <div className={styles.titleRow}>
          <div className={styles.titleContainer}>{editableData.title}</div>
          <div className={styles.actionsContainer}>
            <Tooltip content="Convert Measurements (AI)" relationship="label">
              <Button
                aria-label="Convert Measurements using AI"
                appearance="transparent"
                icon={<SparkleRegular />}
                shape="circular"
                onClick={handleAiConvert}
                disabled={isConverting || !editableData?.content}
              />
            </Tooltip>
            <Tooltip content="Add to Collection" relationship="label">
              <Button
                aria-label="Add to Collection"
                appearance="transparent"
                icon={isLiked ? <Heart20Filled /> : <Heart20Regular />}
                shape="circular"
                onClick={handleAddToCollection}
                className={styles.favoriteButton}
              />
            </Tooltip>
            <RecipeActions />
          </div>
        </div>
        <RecipeHeaderSaveBar
          hasEdits={hasEdits}
          onSave={saveChanges}
          onCancel={cancelEditing}
        />
        <div className={styles.subContentContainer}>
          <RecipeAuthor />
          <StarRating
            rating={editableData.rating}
            onChange={(value) => {
              updateEditableDataKey("rating", value);
              saveChanges({ rating: value });
            }}
          />
          {formattedDate && (
            <Text block italic className={styles.date}>
              Created: {formattedDate}
            </Text>
          )}
        </div>
      </FadeIn>
    </>
  );
};
