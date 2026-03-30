import { clsx } from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./RecipeCard.module.css";
import type { RecipeCardProps } from "./RecipeCard.types";
import { BodyText, MetaLabel } from "../Typography";

import { formatDate } from "../../utils/formatDate";

const MAX_VISIBLE_TAGS = 3;
const NEW_RECIPE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

const SkeletonContent = () => (
  <>
    <div className={clsx(styles.skeletonBlock, styles.skeletonMedia)} />
    <div className={styles.skeletonBody}>
      <div className={clsx(styles.skeletonBlock, styles.skeletonTitle)} />
      <div className={clsx(styles.skeletonBlock, styles.skeletonTitleSecond)} />
      <div className={clsx(styles.skeletonBlock, styles.skeletonCreator)} />
      <div className={clsx(styles.skeletonBlock, styles.skeletonMeta)} />
    </div>
  </>
);

export const RecipeCard = ({
  recipe,
  onClick,
  className,
  showMeta = true,
  isLoading = false,
  showActions = true,
  isMinimal = false,
}: RecipeCardProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <article
        className={clsx(styles.card, className)}
        aria-label="Loading recipe"
        aria-busy="true"
      >
        <SkeletonContent />
      </article>
    );
  }

  if (!recipe) {
    return null;
  }

  const creatorName = recipe.creatorName;
  const savedCount = recipe.savedCount ?? 0;
  const allTags = recipe.tags ?? [];
  const visibleTags = allTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = allTags.length - visibleTags.length;
  const hasImage = Boolean(recipe.imageURL);
  const isNew =
    Boolean(recipe.createdAt) &&
    Date.now() - new Date(recipe.createdAt).getTime() < NEW_RECIPE_THRESHOLD_MS;

  const handleClick = () => {
    onClick?.(recipe);
    if (recipe._id) {
      void router.push(`/recipes/${recipe._id}`);
    }
  };

  const content = (
    <>
      <div
        className={clsx(styles.media, !hasImage && styles.mediaFallback)}
        role={!hasImage ? "img" : undefined}
        aria-label={!hasImage ? `${recipe.title} placeholder emoji` : undefined}
      >
        {hasImage ? (
          <Image
            src={recipe.imageURL}
            alt={recipe.title}
            fill
            sizes="(max-width: 720px) 100vw, 240px"
            className={styles.mediaImage}
          />
        ) : (
          <span className={styles.emoji} aria-hidden="true">
            {recipe.emoji.length > 0 ? recipe.emoji : "🍲"}
          </span>
        )}
      </div>
      <div className={styles.body}>
        {isNew && <span className={styles.newBadge}>NEW</span>}
        <BodyText as="h3" className={clsx(styles.title, !recipe.title && styles.untitled)}>
          {recipe.title || "Untitled Recipe"}
        </BodyText>
        {showMeta && creatorName ? (
          <MetaLabel as="span" className={styles.creator}>
            By {creatorName} • {savedCount} saves
          </MetaLabel>
        ) : (
          showMeta && (
            <div className={styles.metaRow}>
              <MetaLabel as="span" className={styles.metaItem}>
                {formatDate(recipe.createdAt)}
              </MetaLabel>
            </div>
          )
        )}
        {showMeta && visibleTags.length > 0 && (
          <div className={styles.tags}>
            {visibleTags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
            {hiddenTagCount > 0 && (
              <span className={styles.tagMore}>+{hiddenTagCount} more</span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const cardButton = (
    <button
      type="button"
      onClick={handleClick}
      aria-label={recipe.title || "Untitled Recipe"}
      className={clsx(styles.card, styles.interactive, className)}
    >
      {content}
    </button>
  );

  if (!isMinimal && showActions) {
    return (
      <div className={styles.cardWrapper}>
        {cardButton}
        <button
          type="button"
          aria-label="more options"
          className={styles.actionsButton}
          onClick={(e) => e.stopPropagation()}
        >
          ⋯
        </button>
      </div>
    );
  }

  return cardButton;
};
