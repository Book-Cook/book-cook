import * as React from "react";
import {
  Title3,
  Text,
  Button,
  tokens,
  Skeleton,
  SkeletonItem,
} from "@fluentui/react-components";
import { ArrowLeftRegular, ArrowRightRegular } from "@fluentui/react-icons";
import { mergeClasses } from "@griffel/react";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/router";

import { useRecipeCarouselStyles } from "./RecipeCarousel.styles";
import type { RecipesCarouselProps } from "./RecipeCarousel.types";
import { RecipeCard } from "../RecipeCard/RecipeCard";

const emblaOptions: EmblaOptionsType = {
  align: "start",
  dragFree: true,
  containScroll: "trimSnaps",
  loop: false,
};

function useCarouselControls(emblaApi: EmblaCarouselType | undefined) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(
    () => emblaApi?.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = React.useCallback(
    () => emblaApi?.scrollNext(),
    [emblaApi]
  );
  const scrollTo = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const updateState = React.useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setScrollSnaps(emblaApi.scrollSnapList());
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }
    updateState();
    emblaApi.on("select", updateState);
    emblaApi.on("reInit", updateState);
    return () => {
      emblaApi.off("select", updateState);
      emblaApi.off("reInit", updateState);
    };
  }, [emblaApi, updateState]);

  return {
    selectedIndex,
    scrollSnaps,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
  };
}

const skeletonCount = 6;

export const RecipesCarousel: React.FC<RecipesCarouselProps> = (props) => {
  const { recipes, title, isLoading = true } = props;

  const styles = useRecipeCarouselStyles();
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
  const router = useRouter();

  const {
    selectedIndex,
    scrollSnaps,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
  } = useCarouselControls(emblaApi);

  const handleCardClick = React.useCallback(
    async (id: string) => {
      await router.push(`/recipes/${id}`);
    },
    [router]
  );

  if (!isLoading && recipes.length === 0) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <Title3 className={styles.title}>{title}</Title3>{" "}
        </div>
        <div className={styles.emptyState}>
          <Text size={400}>{`You haven't viewed any recipes yet.`}</Text>
          <Text size={300} style={{ marginTop: tokens.spacingVerticalS }}>
            {`Start exploring recipes and they'll show up here.`}{" "}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Title3 className={styles.title}>{title}</Title3>
        <div className={styles.controls}>
          <Button
            className={styles.navButton}
            appearance="subtle"
            icon={<ArrowLeftRegular />}
            onClick={scrollPrev}
            disabled={!canScrollPrev || isLoading}
            aria-label="Previous recipes"
          />
          <Button
            className={styles.navButton}
            appearance="subtle"
            icon={<ArrowRightRegular />}
            onClick={scrollNext}
            disabled={!canScrollNext || isLoading}
            aria-label="Next recipes"
          />
        </div>
      </div>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {!isLoading
            ? recipes.map((recipe) => (
                <div className={styles.slide} key={recipe._id}>
                  <RecipeCard
                    id={recipe._id}
                    emoji={recipe?.emoji || "🍽️"}
                    title={recipe.title}
                    imageSrc={recipe.imageURL}
                    tags={recipe.tags}
                    createdDate={recipe.createdAt}
                    isMinimal
                  />
                  <div
                    className={styles.cardClickOverlay}
                    onClick={() => handleCardClick(recipe._id)}
                  />
                </div>
              ))
            : Array.from({ length: skeletonCount }).map((_, index) => (
                <div className={styles.slide} key={`skeleton-${index}`}>
                  <Skeleton>
                    <div className={styles.skeletonItemContainer}>
                      <SkeletonItem
                        shape="rectangle"
                        className={styles.skeletonImage}
                      />
                      <div className={styles.skeletonTextContent}>
                        <SkeletonItem
                          shape="rectangle"
                          className={styles.skeletonTitle}
                        />
                        <SkeletonItem
                          shape="rectangle"
                          className={styles.skeletonLine}
                        />
                      </div>
                    </div>
                  </Skeleton>
                </div>
              ))}
        </div>
      </div>
      {scrollSnaps.length > 1 && (
        <div className={styles.pagination} aria-label="Recipe pagination">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={mergeClasses(
                styles.paginationDot,
                index === selectedIndex && styles.paginationDotActive
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selectedIndex ? "step" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};
