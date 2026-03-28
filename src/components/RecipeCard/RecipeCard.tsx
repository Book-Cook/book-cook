import { clsx } from "clsx";
import Image from "next/image";

import styles from "./RecipeCard.module.css";
import type { RecipeCardProps } from "./RecipeCard.types";
import { BodyText, MetaLabel } from "../Typography";

import { formatDate } from "../../utils/formatDate";

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
}: RecipeCardProps) => {
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

  const isInteractive = Boolean(onClick);
  const creatorName = recipe.creatorName;
  const tags = recipe.tags?.slice(0, 3) ?? [];

  const metaParts = [
    { key: "created", label: formatDate(recipe.createdAt) },
  ] as { key: string; label: string }[];
  const hasImage = Boolean(recipe.imageURL);

  const content = (
    <>
      <div
        className={clsx(styles.media, !hasImage && styles.mediaFallback)}
        role={!hasImage ? "img" : undefined}
        aria-label={!hasImage ? recipe.title : undefined}
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
        <BodyText as="h3" className={styles.title}>
          {recipe.title}
        </BodyText>
        {showMeta && creatorName && (
          <MetaLabel as="span" className={styles.creator}>
            {creatorName}
          </MetaLabel>
        )}
        {showMeta && (
          <div className={styles.metaRow}>
            {metaParts.map((part, index) => (
              <span key={part.key} className={styles.metaGroup}>
                {index > 0 && (
                  <span className={styles.dot} aria-hidden="true">
                    •
                  </span>
                )}
                <MetaLabel as="span" className={styles.metaItem}>
                  {part.label}
                </MetaLabel>
              </span>
            ))}
          </div>
        )}
        {showMeta && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={() => onClick?.(recipe)}
        className={clsx(styles.card, styles.interactive, className)}
      >
        {content}
      </button>
    );
  }

  return <article className={clsx(styles.card, className)}>{content}</article>;
};
