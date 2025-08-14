import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "100%",
    position: "relative",
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
    "@media (max-width: 768px)": {
      position: "absolute",
      left: "0",
      top: "0",
      height: "100%",
      width: "280px",
      boxShadow: tokens.shadow16,
      transform: "translateX(-100%)",
      transition: "transform 0.3s ease",
      borderTop: "none",
      zIndex: 15,
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
  mobileToggle: {
    position: "absolute",
    top: "80px",
    left: "16px",
    zIndex: 20,
    display: "none",
    "@media (max-width: 768px)": {
      display: "block",
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
  viewControls: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    flexWrap: "wrap",
    justifyContent: "space-between",
    "@media (max-width: 768px)": {
      gap: tokens.spacingHorizontalXS,
      padding: tokens.spacingVerticalXS,
      justifyContent: "flex-start",
    },
  },
  viewButtons: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
    "@media (max-width: 768px)": {
      gap: tokens.spacingHorizontalXS,
    },
  },
  viewButton: {
    minWidth: "60px",
    "@media (max-width: 768px)": {
      minWidth: "50px",
      fontSize: tokens.fontSizeBase200,
      padding: "4px 8px",
    },
  },
  navigationButtons: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
    flexShrink: 0,
    "@media (max-width: 768px)": {
      marginLeft: "auto",
    },
  },
  dateDisplay: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    flex: 1,
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "@media (max-width: 768px)": {
      fontSize: tokens.fontSizeBase300,
      flex: "none",
      textAlign: "left",
      minWidth: 0,
      order: 3,
      width: "100%",
      marginTop: tokens.spacingVerticalXS,
    },
  },
  calendarContent: {
    height: "calc(100vh - 120px)",
    overflow: "hidden",
  },
});