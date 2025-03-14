import * as React from "react";
import { Card, CardHeader, Text, tokens } from "@fluentui/react-components";
import { BookOpenRegular } from "@fluentui/react-icons";
import { useRouter } from "next/router";
import Image from "next/image";
import { RecipeCardProps } from "./RecipeCard.types";
import { makeStyles, shorthands } from "@griffel/react";

const useStyles = makeStyles({
  card: {
    width: "100%",
    height: "360px",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    ...shorthands.borderRadius("12px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),

    ":hover": {
      transform: "translateY(-2px)",
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  cardInner: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    position: "relative",
    height: "220px",
    width: "100%",
    overflow: "hidden",
  },
  image: {
    objectFit: "cover",
  },
  placeholderImage: {
    height: "100%",
    width: "100%",
    background: `linear-gradient(45deg, ${tokens.colorNeutralBackground3}, ${tokens.colorNeutralBackground2})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    ...shorthands.padding("16px"),
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    background: tokens.colorNeutralBackground1,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "auto",
  },
  tag: {
    ...shorthands.padding("4px", "10px"),
    ...shorthands.borderRadius("16px"),
    fontSize: "12px",
    fontWeight: 500,
    background: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    whiteSpace: "nowrap",
  },
  badgeNew: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
    ...shorthands.padding("4px", "8px"),
    ...shorthands.borderRadius("4px"),
    fontSize: "11px",
    fontWeight: 600,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 1,
  },

  moreTag: {
    ...shorthands.padding("4px", "10px"),
    ...shorthands.borderRadius("16px"),
    fontSize: "12px",
    fontWeight: 500,
    background: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
  },
});

export const RecipeCard: React.FC<RecipeCardProps> = (props) => {
  const { title, createdDate, imageSrc, tags, id } = props;
  const router = useRouter();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const styles = useStyles();

  const onCardClick = () => {
    router.push(`/recipes/${id}`);
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
    if (!createdDate) return false;

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
            />
          ) : (
            <div className={styles.placeholderImage}>
              <BookOpenRegular fontSize={48} style={{ opacity: 0.5 }} />
            </div>
          )}
        </div>

        <div className={styles.content}>
          <CardHeader
            header={
              <Text weight="semibold" size={500} style={{ lineHeight: "1.3" }}>
                {title}
              </Text>
            }
            description={
              <Text
                size={200}
                style={{ color: tokens.colorNeutralForeground3 }}
              >
                {formattedDate}
              </Text>
            }
            style={{ padding: "0 0 12px 0" }}
          />

          {tags && tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className={styles.moreTag}>+{tags.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
