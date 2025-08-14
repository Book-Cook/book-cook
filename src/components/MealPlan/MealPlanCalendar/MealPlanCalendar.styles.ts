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
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  viewButton: {
    minWidth: "80px",
  },
  navigationButtons: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    marginLeft: "auto",
  },
  dateDisplay: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    marginLeft: tokens.spacingHorizontalL,
  },
  calendarContent: {
    height: "calc(100vh - 120px)",
    overflow: "hidden",
  },
});