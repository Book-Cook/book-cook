import * as React from "react";
import { Card, Text, tokens, Tooltip } from "@fluentui/react-components";
import Image from "next/image";
import { useRouter } from "next/router";

import { useRecipeCardStyles } from "./RecipeCard.styles";
import type { RecipeCardProps } from "./RecipeCard.types";
import { RecipeActions } from "../RecipeActions";

const RecipeCardComponent: React.FC<RecipeCardProps> = (props) => {
  const { 
    title, 
    createdDate, 
    imageSrc, 
    tags, 
    id, 
    emoji, 
    isMinimal, 
    isPublic, 
    creatorName, 
    savedCount, 
    showActions = true 
  } = props;
  const router = useRouter();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const styles = useRecipeCardStyles();

  const onCardClick = async () => {
    await router.push(`/recipes/${id}`);
  };

  // Format date to be more readable
  const formattedDate = createdDate
    ? new Date(createdDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  /**
   * Check if the recipe is new (created within the last 24 hours)
   * TODO: We should check if the user has already clicked the card in the future
   */
  const isNew = React.useMemo(() => {
    if (!createdDate) {
      return false;
    }

    const recipeDate = new Date(createdDate);
    const currentDate = new Date();

    // Calculate time difference in milliseconds
    const timeDifference = currentDate.getTime() - recipeDate.getTime();

    // Convert to hours (ms to hours)
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference <= 24;
  }, [createdDate]);

  return (
    <Card ref={cardRef} onClick={onCardClick} className={styles.card}>
      <div className={styles.cardInner}>
        {isNew && <span className={styles.badgeNew}>NEW</span>}
        <div className={styles.imageContainer}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              draggable={false}
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span
                className={styles.emojiFallback}
                role="img"
                aria-label={`${title} placeholder emoji`}
              >
                {emoji || "🍽️"}
              </span>
            </div>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.headerRoot}>
            <div className={styles.headerContent}>
              <Tooltip content={title} relationship="label">
                <Text
                  weight="semibold"
                  size={500}
                  className={styles.title}
                  truncate
                >
                  {title}
                </Text>
              </Tooltip>
              {creatorName ? (
                <Text
                  size={200}
                  className={styles.description}
                  style={{ color: tokens.colorNeutralForeground3 }}
                >
                  By {creatorName} • {savedCount ?? 0} saves
                </Text>
              ) : formattedDate ? (
                <Text
                  size={200}
                  className={styles.description}
                  style={{ color: tokens.colorNeutralForeground3 }}
                >
                  {formattedDate}
                </Text>
              ) : null}
            </div>

            {!isMinimal && showActions && (
              <div className={styles.headerAction}>
                <RecipeActions
                  title={title}
                  imageURL={imageSrc}
                  tags={tags}
                  _id={id}
                  emoji={emoji || "🍽️"}
                  isPublic={isPublic ?? false}
                />
              </div>
            )}
          </div>
          {!isMinimal && tags && tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <Tooltip
                  content={
                    <div>
                      {tags.slice(3).map((tag, i, arr) => (
                        <>
                          {tag}
                          {i < arr.length - 1 ? "," : ""}
                        </>
                      ))}
                    </div>
                  }
                  relationship="label"
                >
                  <span className={styles.moreTag}>
                    +{tags.length - 3} more
                  </span>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const RecipeCard = React.memo(RecipeCardComponent, (prevProps, nextProps) => {
  // Only re-render if essential props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.createdDate === nextProps.createdDate &&
    prevProps.imageSrc === nextProps.imageSrc &&
    prevProps.isPublic === nextProps.isPublic &&
    prevProps.isMinimal === nextProps.isMinimal &&
    prevProps.creatorName === nextProps.creatorName &&
    prevProps.savedCount === nextProps.savedCount &&
    prevProps.showActions === nextProps.showActions &&
    JSON.stringify(prevProps.tags) === JSON.stringify(nextProps.tags)
  );
});
