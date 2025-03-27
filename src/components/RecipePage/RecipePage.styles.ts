import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  pageContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    ...shorthands.padding("20px", "16px", "40px"),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  recipeCard: {
    maxWidth: "840px",
    width: "100%",
    marginBottom: "100px",
    ...shorthands.padding("20px"),
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "rgba(0, 0, 0, 0.08) 0px 8px 24px",
    overflow: "hidden",
  },
  topSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: "30px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
  divider: {
    padding: "0px 36px",
    margin: "10px auto",
    opacity: "0.6",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "30px",
    padding: "24px 36px",
    "@media (max-width: 768px)": {
      padding: "0 24px",
    },
  },
});
