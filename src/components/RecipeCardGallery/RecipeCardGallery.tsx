import { clsx } from "clsx";

import styles from "./RecipeCardGallery.module.css";
import type { RecipeCardGalleryProps } from "./RecipeCardGallery.types";
import { RecipeCard } from "../RecipeCard";
import { SubsectionHeading } from "../Typography";

export const RecipeCardGallery = ({
  title,
  recipes,
  onRecipeClick,
  className,
  cardClassName,
  showMeta = true,
  ariaLabel,
  isLoading = false,
  skeletonCount = 6,
}: RecipeCardGalleryProps) => {
  if (!isLoading && recipes.length === 0) {
    return null;
  }

  const resolvedAriaLabel = ariaLabel ?? title ?? "Recipe gallery";

  return (
    <div
      className={clsx(styles.gallery, className)}
      role="region"
      aria-label={resolvedAriaLabel}
      aria-busy={isLoading}
    >
      {title && (
        <div className={styles.header}>
          <SubsectionHeading className={styles.title}>
            {title}
          </SubsectionHeading>
        </div>
      )}
      <ul className={styles.grid} role="list">
        {isLoading
          ? Array.from({ length: skeletonCount }, (_, index) => (
              <li key={`skeleton-${index}`} className={styles.item}>
                <RecipeCard isLoading className={cardClassName} />
              </li>
            ))
          : recipes.map((recipe) => (
              <li key={recipe._id} className={styles.item}>
                <RecipeCard
                  recipe={recipe}
                  onClick={onRecipeClick}
                  showMeta={showMeta}
                  className={cardClassName}
                />
              </li>
            ))}
      </ul>
    </div>
  );
};
