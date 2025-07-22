import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  tabContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: tokens.spacingVerticalM,
  },
  tabList: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: `0 20px`,
    display: "flex",
    gap: tokens.spacingHorizontalM,
  },
  tab: {
    border: "none",
    backgroundColor: "transparent",
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    cursor: "pointer",
    position: "relative",
    transition: "none",
    borderRadius: "0",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "120px",
    borderBottom: "2px solid transparent",
    
    "&:hover": {
      color: tokens.colorNeutralForeground1,
    },
    
    "&:focus-visible": {
      outline: `2px solid ${tokens.colorBrandBackground}`,
      outlineOffset: "2px",
    },
  },
  tabActive: {
    color: `${tokens.colorBrandForeground1} !important`,
    fontWeight: `${tokens.fontWeightSemibold} !important`,
    borderBottom: `2px solid ${tokens.colorBrandForeground1} !important`,
    
    "&:hover": {
      color: `${tokens.colorBrandForeground1} !important`,
    },
  },
  tabContent: {
    flex: 1,
    minHeight: 0, // Allow flex child to shrink below content size
    position: "relative",
    padding: "0 20px",
  },
  tabPanel: {
    height: "100%",
    opacity: 1,
    transform: "translateX(0)",
    transition: "opacity 200ms ease-in-out, transform 200ms ease-in-out",
  },
  tabPanelHidden: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    transform: "translateX(-10px)",
    pointerEvents: "none",
  },
  // Mobile optimizations
  tabListMobile: {
    "@media (max-width: 768px)": {
      padding: `0 ${tokens.spacingHorizontalM}`,
      gap: tokens.spacingHorizontalS,
    },
  },
  tabMobile: {
    "@media (max-width: 768px)": {
      minHeight: "40px",
      fontSize: tokens.fontSizeBase200,
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    },
  },
  tabContainerMobile: {
    "@media (max-width: 768px)": {
      marginBottom: tokens.spacingVerticalS,
    },
  },
});