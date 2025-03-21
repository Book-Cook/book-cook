import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useMobileDrawerStyles = makeStyles({
  mobileMenuButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
  },
  mobileNavLink: {
    fontSize: "18px",
    padding: "12px 0",
    width: "100%",
    textAlign: "left",
  },
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
    ":hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(105, 67, 209, 0.25)",
    },
  },
  activeLink: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
});
