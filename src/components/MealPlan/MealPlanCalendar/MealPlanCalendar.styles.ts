import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "100%",
    position: "relative",
    overflowX: "hidden",
  },
  sidebar: {
    width: "300px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 10,
    borderTop: "none",
    borderBottom: "none",
    overflowX: "hidden",
    "@media (max-width: 768px)": {
      position: "fixed",
      left: "0",
      top: "60px", // Account for toolbar height
      height: "calc(100vh - 60px)", // Subtract toolbar height from viewport
      width: "280px",
      boxShadow: tokens.shadow16,
      transform: "translateX(-100%)",
      transition: "transform 0.3s ease",
      borderTop: "none",
      zIndex: 15,
      overflowX: "hidden",
    },
  },
  sidebarNoTransition: {
    "@media (max-width: 768px)": {
      transition: "none !important",
    },
  },
  sidebarOpen: {
    "@media (max-width: 768px)": {
      transform: "translateX(0)",
    },
  },
  sidebarResizer: {
    position: "absolute",
    right: "0",
    top: "0",
    height: "100%",
    width: "4px",
    cursor: "col-resize",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground,
    },
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  mobileFloatingButton: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 20,
    display: "none",
    boxShadow: tokens.shadow16,
    borderRadius: tokens.borderRadiusLarge,
    "@media (max-width: 768px)": {
      display: "flex",
    },
  },
  overlay: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 12,
    display: "none",
    "@media (max-width: 768px)": {
      display: "block",
    },
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderLeft: "none",
  },
  calendarContent: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
});