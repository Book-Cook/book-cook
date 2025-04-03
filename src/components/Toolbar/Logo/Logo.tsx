import * as React from "react";
import { tokens } from "@fluentui/react-components";
import { BookOpenFilled } from "@fluentui/react-icons";
import { makeStyles } from "@griffel/react";
import Link from "next/link";

const useStyles = makeStyles({
  logoLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalSNudge,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase500,
    color: tokens.colorNeutralForeground1,
    textDecorationLine: "none",
    cursor: "pointer",
    outlineStyle: "none",
    ":hover > span:first-child": {
      transform: "translateY(-2px)",
      color: tokens.colorBrandForeground2,
    },

    ":hover > span:last-child": {
      color: tokens.colorNeutralForeground1,
    },
  },

  logoIcon: {
    display: "flex",
    alignItems: "center",
    color: tokens.colorBrandForeground1,
    fontSize: "24px",
    transitionProperty: "transform, color",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },

  logoText: {
    lineHeight: 1.2,
    color: tokens.colorNeutralForeground1,
    transitionProperty: "color",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
});

export const Logo = () => {
  const styles = useStyles();

  return (
    <Link href="/" className={styles.logoLink}>
      <span className={styles.logoIcon}>
        <BookOpenFilled />
      </span>
      <span className={styles.logoText}>Book Cook</span>
    </Link>
  );
};
