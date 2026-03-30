import { useEffect, useRef, useState } from "react";
import {
  CalendarBlankIcon,
  ChartBarIcon,
  TagIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { clsx } from "clsx";

import { RecipeEmoji } from "./RecipeEmoji";
import styles from "./RecipeHeader.module.css";
import type { RecipeHeaderProps } from "./RecipeHeader.types";
import { RecipePropertyRow } from "./RecipePropertyRow";
import { RecipeStats } from "./RecipeStats";
import { RecipeTags } from "./RecipeTags";
import { useRecipeViewSaveState } from "../RecipeViewSaveStateContext";

import { formatDate } from "../../../utils/formatDate";
import { RecipeTitle } from "../../Typography";

export const RecipeHeader = ({
  recipe,
  viewingMode,
  onTagClick,
}: RecipeHeaderProps) => {
  const isEditable = viewingMode === "editor";
  const saveState = useRecipeViewSaveState();

  const [localEmoji, setLocalEmoji] = useState(recipe.emoji ?? "🍲");
  const [localTags, setLocalTags] = useState(recipe.tags ?? []);

  // Sync if recipe changes (e.g. after cancel/reset)
  useEffect(() => {
    setLocalEmoji(recipe.emoji ?? "🍲");
    setLocalTags(recipe.tags ?? []);
  }, [recipe.emoji, recipe.tags]);

  const tags = isEditable ? localTags : (recipe.tags ?? []);
  const showTags = isEditable || tags.length > 0;
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isEditable || !titleRef.current) {return;}
    if (titleRef.current.textContent !== recipe.title) {
      titleRef.current.textContent = recipe.title;
    }
  }, [recipe.title, isEditable]);

  // Auto-focus the title on new (untitled) recipes so the user can start typing immediately
  useEffect(() => {
    if (isEditable && !recipe.title && titleRef.current) {
      titleRef.current.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmojiChange = (emoji: string) => {
    setLocalEmoji(emoji);
    saveState?.updateEmoji(emoji);
  };

  const handleTagsChange = (tags: string[]) => {
    setLocalTags(tags);
    saveState?.updateTags(tags);
  };

  return (
    <header className={styles.header}>
      {recipe.imageURL && (
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${recipe.imageURL})` }}
          role="img"
          aria-label={recipe.title}
        />
      )}
      <div className={clsx(styles.main, isEditable && styles.editorAligned)}>
        <RecipeEmoji
          emoji={localEmoji}
          hasCover={Boolean(recipe.imageURL)}
          onEmojiChange={isEditable ? handleEmojiChange : undefined}
        />
        {isEditable ? (
          <h1
            ref={titleRef}
            className={clsx(styles.title, styles.editableTitle)}
            contentEditable
            suppressContentEditableWarning
            onInput={(event) => {
              saveState?.updateTitle(event.currentTarget.textContent ?? "");
            }}
          />
        ) : (
          <RecipeTitle className={styles.title}>{recipe.title}</RecipeTitle>
        )}
        {(() => {
          const hasLeftContent = Boolean(recipe.creatorName) || showTags;
          const rightContent = (
            <>
              <RecipePropertyRow
                icon={<CalendarBlankIcon size={14} />}
                label="Created"
              >
                {formatDate(recipe.createdAt)}
              </RecipePropertyRow>
              {(recipe.viewCount ?? 0) > 0 || (recipe.savedCount ?? 0) > 0 ? (
                <RecipePropertyRow
                  icon={<ChartBarIcon size={14} />}
                  label="Stats"
                >
                  <RecipeStats
                    viewCount={recipe.viewCount}
                    savedCount={recipe.savedCount}
                  />
                </RecipePropertyRow>
              ) : null}
            </>
          );

          if (!hasLeftContent) {
            return <div className={styles.metaGrid}>{rightContent}</div>;
          }

          return (
            <div className={styles.metaGrid}>
              <div>
                {recipe.creatorName && (
                  <RecipePropertyRow icon={<UserIcon size={14} />} label="Chef">
                    <span className={styles.linkText}>{recipe.creatorName}</span>
                  </RecipePropertyRow>
                )}
                {showTags && (
                  <RecipePropertyRow icon={<TagIcon size={14} />} label="Tags">
                    <RecipeTags
                      tags={tags}
                      editable={isEditable}
                      onTagClick={onTagClick}
                      onTagsChange={isEditable ? handleTagsChange : undefined}
                    />
                  </RecipePropertyRow>
                )}
              </div>
              <div>{rightContent}</div>
            </div>
          );
        })()}
      </div>
    </header>
  );
};
