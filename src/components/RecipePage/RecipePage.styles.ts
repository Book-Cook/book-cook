import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  pageContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  recipeCard: {
    maxWidth: "740px",
    width: "100%",
    marginBottom: "100px",
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalM),
    overflow: "visible",
  },
  topSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    ...shorthands.gap(tokens.spacingVerticalM),
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
