import { tokens } from "@fluentui/react-components";
import { makeStyles, shorthands } from "@griffel/react";

export const useRecipeCarouselStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    marginBottom: tokens.spacingVerticalXXXL,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.spacingVerticalL,
    "@media (max-width: 480px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: tokens.spacingVerticalM,
    },
  },
  title: {
    margin: 0,
    paddingRight: tokens.spacingHorizontalM,
  },
  viewport: {
    overflow: "hidden",
    width: "100%",
  },
  container: {
    display: "flex",
    gap: tokens.spacingHorizontalXXL,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    userSelect: "none",
    WebkitTouchCallout: "none",
    KhtmlUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "pan-y pinch-zoom",
  },
  slide: {
    position: "relative",
    flexShrink: 0,
    width: "240px",
    "@media (max-width: 640px)": { width: "180px" },
    justifyContent: "center",
  },
  cardClickOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    zIndex: 1,
    backgroundColor: "transparent",
  },
  controls: {
    display: "flex",
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 480px)": { display: "none" },
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "40px",
    width: "40px",
    height: "40px",
    maxWidth: "40px",
    ...shorthands.padding(0),
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow4,
    backgroundColor: tokens.colorNeutralBackground1,
    transitionProperty: "transform, box-shadow, border-color, background-color",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    ":hover:not(:disabled)": {
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
      transform: "translateY(-2px) scale(1.02)",
      boxShadow: tokens.shadow8,
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
    ":active:not(:disabled)": {
      transform: "translateY(0px) scale(0.98)",
      boxShadow: tokens.shadow2,
      backgroundColor: tokens.colorSubtleBackgroundPressed,
    },
    ":disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
      boxShadow: tokens.shadow2,
    },
  },
  pagination: {
    display: "none",
    justifyContent: "center",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalL,
    "@media (max-width: 480px)": { display: "flex" },
  },
  paginationDot: {
    appearance: "none",
    touchAction: "manipulation",
    display: "inline-flex",
    textDecorationLine: "none",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.border("0"),
    ...shorthands.padding("0"),
    ...shorthands.margin("0"),
    width: "8px",
    height: "8px",
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralBackground4,
    transitionProperty: "width, background-color",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  paginationDotActive: {
    width: "24px",
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...shorthands.padding(tokens.spacingVerticalXXXL),
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
    background: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  skeletonItemContainer: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingHorizontalS),
    height: "280px",
    ...shorthands.borderRadius("12px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: tokens.shadow2,
    ...shorthands.padding("16px"),
  },
  skeletonImage: {
    height: "150px",
  },
  skeletonTitle: {
    height: tokens.fontSizeBase500,
    width: "90%",
  },
  skeletonLine: {
    height: tokens.fontSizeBase300,
    width: "50%",
  },
  skeletonTextContent: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingHorizontalS),
    ...shorthands.padding("16px"),
  },
});
