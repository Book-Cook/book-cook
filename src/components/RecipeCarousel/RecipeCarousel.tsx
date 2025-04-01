import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import { Title3, Text, Button, tokens } from "@fluentui/react-components";
import { ArrowLeftRegular, ArrowRightRegular } from "@fluentui/react-icons";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { motion } from "framer-motion";
import { Recipe } from "../../clientToServer/types";

export type RecentRecipesCarouselProps = {
  /**
   * Array of recently viewed recipes
   */
  recipes: Recipe[] | [];
  /**
   * Title for the carousel section
   */
  title?: string;
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    marginBottom: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    "@media (max-width: 480px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "12px",
    },
  },
  title: {
    margin: 0,
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    overflowX: "hidden",
    ...shorthands.padding("8px", "4px"),
  },
  carouselTrack: {
    display: "flex",
    gap: "24px",
  },
  cardWrapper: {
    position: "relative",
    flexShrink: 0,
    width: "280px",
    "@media (max-width: 640px)": {
      width: "240px",
    },
    "@media (max-width: 480px)": {
      width: "220px",
    },
    pointerEvents: "none", // This prevents the card from receiving clicks during drags
  },
  navigationControls: {
    display: "flex",
    gap: "12px",
    "@media (max-width: 480px)": {
      display: "none",
    },
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    ...shorthands.borderRadius("20px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    transition: "all 0.2s ease",

    ":hover": {
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
      transform: "translateY(-2px)",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "default",
      transform: "none",
    },
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...shorthands.padding("32px"),
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
    background: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius("8px"),
  },
  pagination: {
    display: "none",
    justifyContent: "center",
    gap: "8px",
    marginTop: "16px",
    "@media (max-width: 480px)": {
      display: "flex",
    },
  },
  paginationDot: {
    width: "8px",
    height: "8px",
    ...shorthands.borderRadius("50%"),
    background: tokens.colorNeutralBackground4,
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  activeDot: {
    width: "24px",
    background: tokens.colorBrandBackground,
    ...shorthands.borderRadius("4px"),
  },
  // Invisible overlay for click handling that's layered over cards
  cardClickOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "auto", // enable pointer events on the overlay
    cursor: "pointer",
    zIndex: 1,
  },
  // Style to prevent text selection during dragging
  noSelection: {
    WebkitUserSelect: "none",
    userSelect: "none",
    msUserSelect: "none",
    MozUserSelect: "none",
  },
});

export const RecentRecipesCarousel: React.FC<RecentRecipesCarouselProps> = ({
  recipes,
  title = "Recently Viewed Recipes",
}) => {
  const styles = useStyles();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [cardWidth, setCardWidth] = React.useState(280);
  const [gapWidth, setGapWidth] = React.useState(24);
  const [dragStart, setDragStart] = React.useState<number | null>(null);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Track if we've moved enough to be considered a drag vs. a click
  const dragMovedRef = React.useRef(false);

  // Get the number of visible cards based on screen size
  const getVisibleCards = () => {
    if (typeof window === "undefined") return 4; // SSR default

    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 640) return 1.5;
    if (window.innerWidth < 1024) return 2.5;
    return 4;
  };

  const [visibleCards, setVisibleCards] = React.useState(getVisibleCards);

  // Calculate the maximum index we can scroll to
  const maxIndex = Math.max(0, Math.ceil(recipes.length - visibleCards));

  // Check if we can scroll in either direction
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < maxIndex;

  const orderedRecipes = [...recipes].reverse();

  // Update card dimensions and visible cards on resize
  React.useEffect(() => {
    const calculateCardDimensions = () => {
      if (!trackRef.current) return;

      const wrapper = trackRef.current.querySelector('[class*="cardWrapper"]');
      if (wrapper) {
        const computedStyle = window.getComputedStyle(wrapper);
        setCardWidth(parseInt(computedStyle.width));

        const trackStyle = window.getComputedStyle(trackRef.current);
        setGapWidth(parseInt(trackStyle.columnGap || "24"));
      }

      setVisibleCards(getVisibleCards());
    };

    calculateCardDimensions();

    window.addEventListener("resize", calculateCardDimensions);
    return () => window.removeEventListener("resize", calculateCardDimensions);
  }, []);

  // Navigation functions
  const scrollLeft = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const scrollRight = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const scrollTo = (index: number) =>
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));

  // Click handler for cards
  const handleCardClick = (id: string) => {
    // Only allow clicks when not dragging
    if (!isDragging || !dragMovedRef.current) {
      console.log("Navigating to recipe:", id);
      window.location.href = `/recipes/${id}`;
    }
  };

  // Clear the drag state timer
  const clearDragTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Prevent text selection globally when dragging starts
  const preventTextSelection = (prevent: boolean) => {
    document.body.style.userSelect = prevent ? "none" : "";
    document.body.style.webkitUserSelect = prevent ? "none" : "";
  };

  // Mouse/Touch event handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    clearDragTimer();
    dragMovedRef.current = false;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

    setDragStart(clientX);
    setDragOffset(0);

    // Prevent text selection
    preventTextSelection(true);

    // Prevent default browser behavior like text selection
    e.preventDefault();
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStart === null) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

    const delta = clientX - dragStart;

    // If we've moved more than 5px, consider this a drag action, not a potential click
    if (Math.abs(delta) > 5) {
      dragMovedRef.current = true;
    }

    setDragOffset(delta);

    // Prevent default to avoid text selection during drag
    e.preventDefault();
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStart === null) return;

    // Re-enable text selection
    preventTextSelection(false);

    const clientX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;

    const delta = clientX - dragStart;

    // Only count as a swipe if the distance is significant
    if (Math.abs(delta) > cardWidth / 4) {
      if (delta > 0 && canScrollLeft) {
        scrollLeft();
      } else if (delta < 0 && canScrollRight) {
        scrollRight();
      }
    }

    setDragStart(null);
    setDragOffset(0);

    // Reset isDragging after a short delay to allow for click events
    timerRef.current = setTimeout(() => {
      setIsDragging(false);
      dragMovedRef.current = false;
    }, 100);

    // Prevent default
    e.preventDefault();
  };

  // Clean up timeout and selection state on unmount
  React.useEffect(() => {
    return () => {
      clearDragTimer();
      preventTextSelection(false);
    };
  }, []);

  // Empty state
  if (recipes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Title3 className={styles.title}>{title}</Title3>
        </div>
        <div className={styles.emptyState}>
          <Text size={400}>{`You haven't viewed any recipes yet.`}</Text>
          <Text size={300} style={{ marginTop: "8px" }}>
            {`Start exploring recipes and they'll show up here.`}
          </Text>
        </div>
      </div>
    );
  }

  // Calculate the x position for the track
  const trackX =
    dragStart !== null
      ? -currentIndex * (cardWidth + gapWidth) + dragOffset
      : -currentIndex * (cardWidth + gapWidth);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title3 className={styles.title}>{title}</Title3>
        <div className={styles.navigationControls}>
          <Button
            className={styles.navButton}
            appearance="subtle"
            icon={<ArrowLeftRegular />}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Previous recipes"
          />
          <Button
            className={styles.navButton}
            appearance="subtle"
            icon={<ArrowRightRegular />}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Next recipes"
          />
        </div>
      </div>

      <div
        className={`${styles.carouselContainer} ${isDragging ? styles.noSelection : ""}`}
        onMouseDown={handleDragStart}
        onMouseMove={dragStart !== null ? handleDragMove : undefined}
        onMouseUp={handleDragEnd}
        onMouseLeave={dragStart !== null ? handleDragEnd : undefined}
        onTouchStart={handleDragStart}
        onTouchMove={dragStart !== null ? handleDragMove : undefined}
        onTouchEnd={handleDragEnd}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <motion.div
          ref={trackRef}
          className={styles.carouselTrack}
          animate={{ x: trackX }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: dragStart !== null ? 0 : 0.3,
          }}
        >
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.cardWrapper}>
              <RecipeCard
                id={recipe._id}
                title={recipe.title}
                imageSrc={recipe.imageURL}
                tags={recipe.tags}
                createdDate={recipe.createdAt}
              />
              <div
                className={styles.cardClickOverlay}
                onClick={() => handleCardClick(recipe._id)}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pagination dots - only visible on mobile */}
      {recipes.length > visibleCards && (
        <div className={styles.pagination}>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <div
              key={index}
              className={`${styles.paginationDot} ${
                currentIndex === index ? styles.activeDot : ""
              }`}
              onClick={() => scrollTo(index)}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
