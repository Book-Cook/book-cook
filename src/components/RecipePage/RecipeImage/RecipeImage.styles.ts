import { tokens, makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  imageContainer: {
    width: "45%",
    height: "380px",
    position: "relative",
    "@media (max-width: 768px)": {
      width: "100%",
      height: "320px",
      marginBottom: "20px",
    },
  },
  imageUploadContainer: {
    width: "45%",
    height: "380px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `2px dashed ${tokens.colorNeutralStrokeAccessible}`,
    ...shorthands.borderRadius("12px"),
    cursor: "pointer",
    ...shorthands.gap("16px"),
    ...shorthands.margin("16px", "0", "16px", "16px"),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2,
      ...shorthands.borderColor(tokens.colorBrandBackground),
    },
    "@media (max-width: 768px)": {
      width: "100%",
      height: "320px",
      marginBottom: "20px",
      margin: "16px",
    },
  },
  uploadIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: "48px",
  },
  uploadText: {
    color: tokens.colorNeutralForeground2,
    fontWeight: "500",
  },
  recipeImage: {
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "rgba(0, 0, 0, 0.06) 0px 2px 8px",
  },
});
