import { tokens } from "@fluentui/react-components";
import { makeStyles, shorthands } from "@griffel/react";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    position: "relative",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    ...shorthands.borderRadius("8px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.padding("0", "12px"),
    height: "36px",
    backgroundColor: tokens.colorNeutralBackground1,
    transition: "all 0.2s ease",
    ":focus-within": {
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      boxShadow: `0 0 0 1px ${tokens.colorBrandStroke1}`,
    },
  },
  searchIcon: {
    color: tokens.colorNeutralForeground3,
    marginRight: "8px",
    fontSize: "16px",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    color: tokens.colorNeutralForeground1,
    "::placeholder": {
      color: tokens.colorNeutralForeground4,
    },
  },
  addButton: {
    ...shorthands.padding("2px", "8px"),
    ...shorthands.borderRadius("4px"),
    ...shorthands.border("none"),
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralBackground1,
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    ":hover": {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
  dropdown: {
    position: "absolute",
    top: "40px",
    left: 0,
    right: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius("8px"),
    boxShadow: tokens.shadow8,
    zIndex: 100,
    maxHeight: "200px",
    overflowY: "auto",
    animationName: {
      from: {
        opacity: 0,
        transform: "translateY(-4px)",
      },
      to: {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
    animationDuration: "0.2s",
    animationTimingFunction: "ease-out",
  },
  dropdownItem: {
    ...shorthands.padding("8px", "12px"),
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.1s ease",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  selectedTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "8px",
  },
  tagPill: {
    display: "flex",
    alignItems: "center",
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius("16px"),
    ...shorthands.padding("6px", "10px"),
    fontSize: "12px",
    transition: "all 0.2s ease",
    animationName: {
      from: {
        opacity: 0,
        transform: "scale(0.9)",
      },
      to: {
        opacity: 1,
        transform: "scale(1)",
      },
    },
    animationDuration: "0.2s",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  removeButton: {
    background: "none",
    ...shorthands.border("none"),
    marginLeft: "6px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground3,
    transition: "color 0.15s ease",
    ":hover": {
      color: tokens.colorNeutralForeground1,
    },
  },
  emptyMessage: {
    ...shorthands.padding("12px"),
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
    fontSize: "12px",
  },
});
