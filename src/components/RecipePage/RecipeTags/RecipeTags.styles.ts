import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    ...shorthands.gap("10px"),
    marginTop: "12px",
    alignItems: "center",
  },
  tag: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius("20px"),
    ...shorthands.padding("8px", "16px"),
    fontSize: "0.875rem",
    color: tokens.colorNeutralForeground2,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
});
