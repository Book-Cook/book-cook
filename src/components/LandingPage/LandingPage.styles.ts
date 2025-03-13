import { makeStyles, shorthands } from "@griffel/react";
import { tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
    ...shorthands.overflow("hidden"),
  },

  // Hero section
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
    background: "linear-gradient(135deg, #9272e6 0%, #6943d1 100%)",
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

  primaryButton: {
    backgroundColor: "#9272e6",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    height: "48px",
    ...shorthands.padding("0", "28px"),
    ...shorthands.borderRadius("24px"),
    transition: "all 0.3s ease",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 15px rgba(146, 114, 230, 0.2)",
    },
  },

  secondaryButton: {
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
    fontSize: "16px",
    fontWeight: "600",
    height: "48px",
    ...shorthands.padding("0", "28px"),
    ...shorthands.borderRadius("24px"),
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
      transform: "translateY(-2px)",
    },
  },

  // Featured recipes section
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
  },

  recipesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
    width: "100%",
    maxWidth: "1200px",
  },

  recipeCard: {
    transition: "all 0.3s ease",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
    },
  },

  cardImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    ...shorthands.borderRadius("8px"),
  },

  // Features section
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
    ...shorthands.borderRadius("40px"),
    backgroundColor: "rgba(146, 114, 230, 0.1)",
    marginBottom: "24px",
    color: "#9272e6",
    fontSize: "32px",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "scale(1.1)",
    },
  },

  featureTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
  },

  featureDesc: {
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.6,
  },

  // CTA section
  ctaSection: {
    backgroundColor: "#9272e6",
    color: "white",
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
    color: "white",
  },

  ctaDesc: {
    fontSize: "18px",
    marginBottom: "40px",
    maxWidth: "600px",
    lineHeight: 1.6,
  },

  ctaButton: {
    backgroundColor: "white",
    color: "#9272e6",
    fontSize: "18px",
    fontWeight: "600",
    height: "52px",
    ...shorthands.padding("0", "32px"),
    ...shorthands.borderRadius("26px"),
    transition: "all 0.3s ease",
    ":hover": {
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
    },
  },

  // Decorative elements
  floatingBubble: {
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "rgba(146, 114, 230, 0.1)",
    zIndex: 1,
  },

  heroImageContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "1000px",
    height: "400px",
    marginTop: "40px",
  },
});
