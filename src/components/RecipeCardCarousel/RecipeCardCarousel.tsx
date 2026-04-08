import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";

import styles from "./RecipeCardCarousel.module.css";
import type { RecipeCardCarouselProps } from "./RecipeCardCarousel.types";
import { useCarouselNavigation } from "./useCarouselNavigation";
import { Button } from "../Button";
import { RecipeCard } from "../RecipeCard";
import { SubsectionHeading } from "../Typography";

const SKELETON_COUNT = 5;

export const RecipeCardCarousel = ({
  title,
  recipes,
  onRecipeClick,
  className,
  cardClassName,
  showMeta = true,
  ariaLabel,
  emblaOptions,
  isLoading = false,
  initialScrollIndex,
  emptyMessage,
}: RecipeCardCarouselProps) => {
  const hasRecipes = recipes.length > 0;

  const { viewportRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext, handleKeyDown } =
    useCarouselNavigation({ emblaOptions, initialScrollIndex });

  const controlsVisible =
    recipes.length > 1 && (canScrollPrev || canScrollNext);
  const resolvedAriaLabel = ariaLabel ?? title ?? "Recipe carousel";
  const showHeader = Boolean(title) || controlsVisible;

  if (!isLoading && !hasRecipes) {
    if (!emptyMessage) {
      return null;
    }
    return (
      <div className={clsx(styles.carousel, className)}>
        {title && (
          <div className={styles.header}>
            <SubsectionHeading className={styles.title}>
              {title}
            </SubsectionHeading>
          </div>
        )}
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={clsx(styles.carousel, className)}>
        {title && (
          <div className={styles.header}>
            <SubsectionHeading className={styles.title}>
              {title}
            </SubsectionHeading>
          </div>
        )}
        <div className={styles.viewport}>
          <ul className={styles.track} role="list">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <li key={i} className={styles.item}>
                <div className={styles.skeletonCard} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.carousel, className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={resolvedAriaLabel}
    >
      {showHeader && (
        <div className={styles.header}>
          {title ? (
            <SubsectionHeading className={styles.title}>
              {title}
            </SubsectionHeading>
          ) : (
            <span />
          )}
          {controlsVisible && (
            <div className={styles.controls} aria-label="Carousel controls">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                shape="square"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                aria-label="Scroll left"
              >
                <ArrowLeftIcon size={16} aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                shape="square"
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Scroll right"
              >
                <ArrowRightIcon size={16} aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      )}
      <div
        className={styles.viewport}
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <ul className={styles.track} role="list">
          {recipes.map((recipe) => (
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
    </div>
  );
};
