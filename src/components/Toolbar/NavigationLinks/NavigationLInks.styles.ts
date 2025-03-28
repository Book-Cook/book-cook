import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useNavigationStyles = makeStyles({
  linkStyles: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    gap: "8px",
    color: tokens.colorNeutralForeground1,
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "20px",
    position: "relative",
    ...shorthands.padding("8px", "14px"),
    ...shorthands.borderRadius("8px"),
    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",

    "::after": {
      content: '""',
      position: "absolute",
      bottom: "4px",
      left: "50%",
      width: "0",
      height: "2px",
      backgroundColor: tokens.colorBrandBackground,
      transform: "translateX(-50%)",
      transition: "width 0.2s ease-in-out",
      borderRadius: "999px",
    },

    ":hover": {
      color: tokens.colorBrandForeground1,
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(146, 114, 230, 0.15)",
      textDecoration: "none",

      "::after": {
        width: "40%",
      },
    },

    ":active": {
      textDecoration: "none",
    },
  },
  activeLink: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  nextLink: {
    textDecoration: "none",
  },
});
