import { tokens, makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  authorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  authorIcon: {
    fontSize: "16px",
    color: tokens.colorNeutralForeground3,
  },
  authorText: {
    color: tokens.colorNeutralForeground2,
  },
});
