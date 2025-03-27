import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  headerSection: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalL),
    minHeight: "48px",
  },
  titleContainer: {
    flexGrow: 1,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontWeight: tokens.fontWeightSemibold,
    fontFamily: "'Georgia', serif",
    fontSize: tokens.fontSizeHero800,
    lineHeight: tokens.lineHeightHero800,
    overflowWrap: "break-word",
  },
  titleInput: {
    width: "100%",
  },
  actionButtons: {
    display: "flex",
    flexShrink: 0,
    ...shorthands.gap(tokens.spacingHorizontalS),
    alignItems: "center",
  },
  date: {
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    paddingLeft: tokens.spacingHorizontalSNudge,
  },
});
