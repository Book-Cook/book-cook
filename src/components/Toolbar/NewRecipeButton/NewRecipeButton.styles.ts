import { makeStyles, shorthands } from "@griffel/react";

export const useNewRecipeButtonStyles = makeStyles({
  toolbarButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#ffffff",
    fontWeight: "500",
    fontSize: "14px",
    height: "36px",
    textWrap: "nowrap",
    ...shorthands.padding("0", "20px"),
    ...shorthands.borderRadius("8px"),
    border: "none",
    boxShadow: "0 1px 3px rgba(105, 67, 209, 0.15)",
    transition: "all 0.2s ease",
    "@media (max-width: 500px)": {
      display: "none",
    },
    ":hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(105, 67, 209, 0.25)",
    },
  },
});
