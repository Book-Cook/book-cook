import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useMobileDrawerStyles = makeStyles({
  mobileMenu: {
    backgroundColor: tokens.colorNeutralBackground1,
  },

  drawerHeader: {},

  drawerHeaderAction: {
    color: tokens.colorNeutralForeground1,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3,
      transform: "rotate(90deg)",
    },
  },

  drawerContentWrapper: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: 0,
    ...shorthands.padding(
      tokens.spacingVerticalXXL,
      tokens.spacingHorizontalL,
      tokens.spacingVerticalL
    ),
    gap: tokens.spacingVerticalL,
  },

  searchWrapper: {},

  navSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    width: "100%",
  },

  mobileNavLink: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    width: "100%",
    textAlign: "left",
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    transition:
      "transform 0.2s ease, background-color 0.2s ease, color 0.2s ease",
    color: tokens.colorNeutralForeground1,
    justifyContent: "flex-start",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      transform: "translateX(4px)",
      color: tokens.colorNeutralForeground1Hover,
    },
    ":active": {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
      color: tokens.colorNeutralForeground1Pressed,
    },
  },

  activeLink: {
    backgroundColor: tokens.colorSubtleBackgroundSelected,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    position: "relative",
    ":hover": {
      backgroundColor: tokens.colorSubtleBackgroundSelected,
      color: tokens.colorNeutralForeground1,
    },
    "::before": {
      content: "''",
      position: "absolute",
      left: "0",
      top: "50%",
      transform: "translateY(-50%)",
      width: "3px",
      height: "24px",
      backgroundColor: tokens.colorCompoundBrandStroke,
      borderTopRightRadius: tokens.borderRadiusMedium,
      borderBottomRightRadius: tokens.borderRadiusMedium,
      borderTopLeftRadius: "0px",
      borderBottomLeftRadius: "0px",
    },
  },

  footerSection: {
    paddingTop: tokens.spacingVerticalL,
    flexShrink: 0,
  },

  primaryActionButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalS,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    minHeight: "44px",
    width: "100%",
    textWrap: "nowrap",
    ...shorthands.padding("0", tokens.spacingHorizontalL),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    ":hover": {
      transform: "translateY(-2px)",
    },
  },
});
