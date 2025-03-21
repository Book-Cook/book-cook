import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useMobileDrawerStyles = makeStyles({
  mobileMenuButton: {
    position: "absolute",
    top: "16px",
    right: "16px",
    ...shorthands.borderRadius("50%"),
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    padding: "60px 24px 32px",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  mobileNavLink: {
    fontSize: "16px",
    fontWeight: "400",
    padding: "12px 16px",
    width: "100%",
    textAlign: "left",
    justifyContent: "flex-start",
    ...shorthands.border("none"),
    ...shorthands.borderRadius("6px"),
    transition: "all 0.2s ease",
    backgroundColor: "transparent",
    position: "relative", // Add position relative for absolute pseudo-elements
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  toolbarButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "14px",
    height: "48px",
    textWrap: "nowrap",
    ...shorthands.padding("0", "20px"),
    ...shorthands.borderRadius("6px"),
    border: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    ":hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
    },
  },
  activeLink: {
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorBrandForeground1,
    fontWeight: "600",
    ":before": {
      content: '""',
      position: "absolute",
      left: "0",
      top: "8px", // Adjust to position vertically
      bottom: "8px", // Adjust to position vertically
      width: "3px",
      backgroundColor: tokens.colorBrandForeground1,
      ...shorthands.borderRadius("0", "2px", "2px", "0"), // Rounded on right side only
    },
  },
  navSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
  },
  searchBarWrapper: {
    width: "100%",
  },
});
