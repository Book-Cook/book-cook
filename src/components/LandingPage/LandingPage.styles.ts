import { makeStyles, shorthands } from "@griffel/react";
import { tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
    ...shorthands.overflow("hidden"),
    color: tokens.colorNeutralForeground1,
  },

  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    minHeight: "90vh",
    position: "relative",
    ...shorthands.padding("80px", "20px"),
    backgroundColor: tokens.colorNeutralBackground1,
  },

  heroContent: {
    maxWidth: "1200px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
  },

  heading: {
    fontSize: "64px",
    lineHeight: 1.1,
    fontWeight: "800",
    marginBottom: "20px",
    // Gradient uses brand colors - appearance may vary slightly across themes
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackgroundHover} 100%)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    maxWidth: "800px",
  },

  subHeading: {
    fontSize: "20px",
    lineHeight: 1.6,
    color: tokens.colorNeutralForeground2,
    marginBottom: "40px",
    maxWidth: "600px",
    textAlign: "center",
  },

  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginTop: "20px",
  },

  // Styles for custom button elements if not using Fluent Button component
  primaryButton: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: "16px",
    fontWeight: "600",
    height: "48px",
    ...shorthands.padding("0", "28px"),
    ...shorthands.borderRadius(tokens.borderRadiusLarge), // Use token
    border: "none",
    cursor: "pointer",
    transitionProperty: "transform, background-color, box-shadow",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    ":hover": {
      transform: "translateY(-2px)",
      backgroundColor: tokens.colorBrandBackgroundHover,
      boxShadow: tokens.shadow8,
    },
    ":active": {
      backgroundColor: tokens.colorBrandBackgroundPressed,
      transform: "translateY(0)",
      boxShadow: tokens.shadow2,
    },
  },

  secondaryButton: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: "16px",
    fontWeight: "600",
    height: "48px",
    ...shorthands.padding("0", "28px"),
    ...shorthands.borderRadius(tokens.borderRadiusLarge), // Use token
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    cursor: "pointer",
    transitionProperty: "transform, background-color, border-color",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      transform: "translateY(-2px)",
    },
    ":active": {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
      transform: "translateY(0)",
    },
  },

  featuredSection: {
    ...shorthands.padding("80px", "20px"),
    backgroundColor: tokens.colorNeutralBackground2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "48px",
    textAlign: "center",
    color: tokens.colorNeutralForeground1,
  },

  recipesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
    width: "100%",
    maxWidth: "1200px",
  },

  recipeCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    transitionProperty: "transform, box-shadow",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    cursor: "pointer",
    overflow: "hidden", // Ensure image radius applies correctly
    ":hover": {
      transform: "translateY(-8px)",
      boxShadow: tokens.shadow16,
    },
  },

  cardImage: {
    display: "block", // Fix potential spacing issues
    width: "100%",
    height: "200px",
    objectFit: "cover",
    // No radius needed here if recipeCard uses overflow: hidden
  },

  featuresSection: {
    ...shorthands.padding("100px", "20px"),
    backgroundColor: tokens.colorNeutralBackground1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "40px",
    maxWidth: "1200px",
    width: "100%",
  },

  featureItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    ...shorthands.padding("20px"),
  },

  featureIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: tokens.colorBrandBackground2, // Subtle brand background
    marginBottom: "24px",
    color: tokens.colorBrandForeground1,
    fontSize: "32px",
    transition: `transform ${tokens.durationNormal} ${tokens.curveEasyEase}`,
    ":hover": {
      transform: "scale(1.1)",
    },
  },

  featureTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
    color: tokens.colorNeutralForeground1,
  },

  featureDesc: {
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.6,
  },

  ctaSection: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.padding("80px", "20px"),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  ctaTitle: {
    fontSize: "40px",
    fontWeight: "700",
    marginBottom: "20px",
    color: tokens.colorNeutralForegroundOnBrand,
  },

  ctaDesc: {
    fontSize: "18px",
    marginBottom: "40px",
    maxWidth: "600px",
    lineHeight: 1.6,
  },

  ctaButton: {
    backgroundColor: tokens.colorNeutralBackgroundStatic, // Static white
    color: tokens.colorBrandForeground1,
    fontSize: "18px",
    fontWeight: "600",
    height: "52px",
    ...shorthands.padding("0", "32px"),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge), // Use token
    border: "none",
    cursor: "pointer",
    transitionProperty: "transform, box-shadow, color",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    ":hover": {
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: tokens.shadow16,
    },
    ":active": {
      transform: "translateY(0) scale(1)",
      boxShadow: tokens.shadow4,
    },
  },

  floatingBubble: {
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: tokens.colorBrandBackground2, // Subtle brand background
    zIndex: 1,
    opacity: 0.5, // Adjust if needed for subtlety
  },

  heroImageContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "1000px",
    height: "400px",
    marginTop: "40px",
  },
});
