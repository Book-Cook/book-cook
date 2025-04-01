import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  pageContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    ...shorthands.padding("20px", "16px", "40px"),
  },
  recipeCard: {
    maxWidth: "740px",
    width: "100%",
    marginBottom: "100px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
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
  },
});
