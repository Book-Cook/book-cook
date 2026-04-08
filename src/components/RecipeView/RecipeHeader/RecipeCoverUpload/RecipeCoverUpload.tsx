import { forwardRef } from "react";
import { CameraIcon, TrashIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";

import { Button } from "src/components/Button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "src/components/Menu";
import styles from "./RecipeCoverUpload.module.css";
import type { RecipeCoverUploadProps } from "./RecipeCoverUpload.types";
import { useCoverUpload } from "./useCoverUpload";

export const RecipeCoverUpload = forwardRef<
  HTMLInputElement,
  RecipeCoverUploadProps
>(({ recipeId, imageURL }, externalRef) => {
  const {
    uploadState,
    isUploading,
    displayUrl,
    hasImage,
    setInputRef,
    handleFileSelect,
    handleRemoveCover,
    internalRef,
  } = useCoverUpload({ recipeId, imageURL, externalRef });

  return (
    <div className={clsx(styles.root, hasImage && styles.hasCover)}>
      <input
        ref={setInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className={styles.hiddenInput}
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void handleFileSelect(file);
          }
          e.target.value = "";
        }}
      />

      {hasImage && (
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${displayUrl})` }}
          role="img"
          aria-label="Recipe cover photo"
        />
      )}

      {uploadState.status === "uploading" && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${uploadState.progress}%` }}
          />
        </div>
      )}

      {/* Overlay: only shown when a cover image is present */}
      {hasImage && (
        <div className={styles.overlay}>
          {isUploading ? (
            <Button
              variant="ghost"
              size="sm"
              shape="square"
              isLoading
              disabled
              aria-label="Uploading cover"
            />
          ) : (
            <Menu>
              <MenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  shape="square"
                  startIcon={<CameraIcon size={16} weight="bold" />}
                  aria-label="Cover photo options"
                />
              </MenuTrigger>
              <MenuContent align="center">
                <MenuItem
                  startIcon={<CameraIcon size={14} />}
                  onSelect={() => internalRef.current?.click()}
                >
                  Change cover
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  startIcon={<TrashIcon size={14} />}
                  onSelect={() => void handleRemoveCover()}
                  style={{ color: "var(--danger-Primary)" }}
                >
                  Remove cover
                </MenuItem>
              </MenuContent>
            </Menu>
          )}
        </div>
      )}
    </div>
  );
});

RecipeCoverUpload.displayName = "RecipeCoverUpload";
