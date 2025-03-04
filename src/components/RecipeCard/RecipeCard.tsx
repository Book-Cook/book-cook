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
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    ...shorthands.borderRadius("12px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),

    ":hover": {
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      transform: "translateY(-2px)",
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      background: tokens.colorNeutralBackground1Hover,
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
    transition: "transform 0.5s ease",

    ":hover": {
      transform: "scale(1.05)",
    },
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

  // Card hover animation effect
  React.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element

      // Calculate rotation based on mouse position (subtle effect)
      const xRotation = ((y - rect.height / 2) / rect.height) * 4;
      const yRotation = ((rect.width / 2 - x) / rect.width) * 4;

      card.style.transform = `perspective(1000px) scale(1.03) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

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

  return (
    <Card ref={cardRef} onClick={onCardClick} className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.imageContainer}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
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
