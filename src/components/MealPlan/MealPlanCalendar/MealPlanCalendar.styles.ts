import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "100%",
  },
  sidebar: {
    width: "300px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
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