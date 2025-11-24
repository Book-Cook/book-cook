import * as React from "react";
import { Text, Tooltip } from "@fluentui/react-components";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./RecipeCard.module.css";
import type { RecipeCardProps } from "./RecipeCard.types";
import { Card } from "../Card";
import { RecipeActions } from "../RecipeActions";

const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

export const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
  (
    {
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
      showActions = true,
      isPast = false,
      className,
      ...rest
    },
    ref
  ): React.ReactElement => {
    const router = useRouter();

    const onCardClick = React.useCallback(async () => {
      await router.push(`/recipes/${id}`);
    }, [id, router]);

    const createdDateObj = React.useMemo(
      () => (createdDate ? new Date(createdDate) : null),
      [createdDate]
    );

    const formattedDate = React.useMemo(
      () =>
        createdDateObj
          ? createdDateObj.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
      [createdDateObj]
    );

    const isNew = React.useMemo(() => {
      if (!createdDateObj) {
        return false;
      }
      return (Date.now() - createdDateObj.getTime()) / (1000 * 60 * 60) <= 24;
    }, [createdDateObj]);

    const tagsToShow = React.useMemo(() => tags?.slice(0, 3) ?? [], [tags]);
    const overflowTags = React.useMemo(() => tags?.slice(3) ?? [], [tags]);

    const cardClassName = [styles.card, isPast && styles.pastCard, className]
      .filter(Boolean)
      .join(" ");
    const contentClassName = [styles.content, isPast && styles.pastContent]
      .filter(Boolean)
      .join(" ");

    return (
      <Card ref={ref} onClick={onCardClick} className={cardClassName} {...rest}>
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
                blurDataURL={PLACEHOLDER_BLUR}
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
          <div className={contentClassName}>
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
                    className={`${styles.description} ${styles.descriptionTint}`}
                  >
                    By {creatorName} • {savedCount ?? 0} saves
                  </Text>
                ) : formattedDate ? (
                  <Text
                    size={200}
                    className={`${styles.description} ${styles.descriptionTint}`}
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
            {!isMinimal && tagsToShow.length > 0 && (
              <div className={styles.tagsContainer}>
                {tagsToShow.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
                {overflowTags.length > 0 && (
                  <Tooltip
                    content={
                      <div>
                        {overflowTags.map((tag, tagIndex, arr) => (
                          <span key={tag}>
                            {tag}
                            {tagIndex < arr.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    }
                    relationship="label"
                  >
                    <span className={styles.moreTag}>
                      +{overflowTags.length} more
                    </span>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

RecipeCard.displayName = "RecipeCard";
