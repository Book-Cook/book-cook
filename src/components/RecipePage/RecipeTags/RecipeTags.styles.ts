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
  editableTag: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderRadius("20px"),
    ...shorthands.padding("8px", "16px"),
    fontSize: "0.875rem",
    color: tokens.colorBrandForeground2,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground,
    },
  },
  removeTagIcon: {
    cursor: "pointer",
    fontSize: "12px",
    opacity: "0.7",
    "&:hover": {
      opacity: "1",
    },
  },
  tagInputContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    marginLeft: "4px",
  },

  tagInput: {
    height: "36px",
    minWidth: "150px",
    ...shorthands.margin("0"),
    ...shorthands.padding("0", "16px"),
    ...shorthands.borderRadius("18px"),
    fontSize: "0.875rem",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    "&:focus-within": {
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  addTagButton: {
    ...shorthands.borderRadius("50%"),
    width: "36px",
    height: "36px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    cursor: "pointer",
    marginLeft: "8px",
  },
});
