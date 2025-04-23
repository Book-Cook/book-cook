import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export const useHeaderStyles = makeStyles({
  headerSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  titleRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    width: "100%",
    ...shorthands.gap(tokens.spacingHorizontalL),
  },
  titleContainer: {
    flexGrow: 1,
    minWidth: 0,
    fontFamily: "'Georgia', serif",
    padding: "0px 6px",
    fontSize: tokens.fontSizeHero800,
    lineHeight: tokens.lineHeightHero800,
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordWrap: "break-word",
  },
  subContentContainer: {
    display: "flex",
    gap: "8px",
    flexDirection: "column",
    paddingLeft: tokens.spacingHorizontalSNudge,
  },
  date: {
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  favoriteButton: {
    color: tokens.colorPaletteRedForeground1,
    ":hover": {
      color: tokens.colorPaletteRedForeground2,
    },
    ":hover:active": {
      color: tokens.colorPaletteRedForeground3,
    },
  },
  actionsContainer: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalS),
    flexShrink: 0,
    justifyContent: "flex-end",
  },
});
