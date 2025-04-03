import { tokens } from "@fluentui/react-components";
import { makeStyles, shorthands } from "@griffel/react";

export const useRecipeCardStyles = makeStyles({
  card: {
    width: "100%",
    height: "280px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    ...shorthands.borderRadius("12px"),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),

    ":hover": {
      transform: "translateY(-2px)",
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  cardInner: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    position: "relative",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  image: {
    objectFit: "cover",
  },
  placeholderImage: {
    height: "100%",
    width: "100%",
    background: `linear-gradient(45deg, ${tokens.colorNeutralBackground3}, ${tokens.colorNeutralBackground2})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    ...shorthands.padding("16px"),
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    background: tokens.colorNeutralBackground1,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "auto",
  },
  tag: {
    ...shorthands.padding("4px", "10px"),
    ...shorthands.borderRadius("16px"),
    fontSize: "12px",
    fontWeight: 500,
    background: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    whiteSpace: "nowrap",
  },
  badgeNew: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
    ...shorthands.padding("4px", "8px"),
    ...shorthands.borderRadius("4px"),
    fontSize: "11px",
    fontWeight: 600,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 1,
  },

  moreTag: {
    ...shorthands.padding("4px", "10px"),
    ...shorthands.borderRadius("16px"),
    fontSize: "12px",
    fontWeight: 500,
    background: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
  },
});
