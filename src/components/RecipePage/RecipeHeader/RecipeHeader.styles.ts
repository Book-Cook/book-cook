import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  headerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  title: {
    margin: 0,
    fontWeight: "600",
    fontFamily: "'Georgia', serif",
    fontSize: "2.2rem",
    lineHeight: "1.2",
  },
  titleInput: {
    fontSize: "2rem",
    fontWeight: "600",
    fontFamily: "'Georgia', serif",
    width: "100%",
    border: "none",
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.borderRadius("0"),
    paddingBottom: "8px",
    "&:focus": {
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      outline: "none",
    },
  },
  actionButtons: {
    display: "flex",
    ...shorthands.gap("12px"),
    alignItems: "center",
  },
  actionButton: {
    minWidth: "36px",
    height: "36px",
    ...shorthands.padding("0"),
    ...shorthands.borderRadius("18px"),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  date: {
    color: tokens.colorNeutralForeground3,
    marginTop: "4px",
    fontStyle: "italic",
  },
});
