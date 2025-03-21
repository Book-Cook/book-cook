import { makeStyles, shorthands } from "@griffel/react";
import { tokens } from "@fluentui/react-components";

export const useToolbarStyles = makeStyles({
  root: {
    position: "sticky",
    top: "0px",
    height: "60px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    flexShrink: 0,
    zIndex: 10000,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)",
    ...shorthands.padding("0", "24px"),
    ...shorthands.borderRadius(0, 0, "8px", "8px"),
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    "@media (max-width: 768px)": {
      gap: "8px",
    },
  },
  navLinks: {
    display: "flex",
    gap: "8px",
    paddingLeft: "32px",
    "@media (max-width: 900px)": {
      display: "none", // Hide on mobile
    },
  },
  hamburgerButton: {
    display: "none", // Hidden by default on desktop
    "@media (max-width: 900px)": {
      display: "flex",
    },
  },
  toolbarButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#ffffff",
    fontWeight: "500",
    fontSize: "14px",
    height: "36px",
    textWrap: "nowrap",
    ...shorthands.padding("0", "20px"),
    ...shorthands.borderRadius("8px"),
    border: "none",
    boxShadow: "0 1px 3px rgba(105, 67, 209, 0.15)",
    transition: "all 0.2s ease",
    "@media (max-width: 500px)": {
      display: "none",
    },
    ":hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(105, 67, 209, 0.25)",
    },
  },
  searchBarWrapper: {
    "@media (max-width: 900px)": {
      display: "none",
    },
  },
});
