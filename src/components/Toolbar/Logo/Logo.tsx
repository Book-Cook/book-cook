import * as React from "react";
import { Link as FluentLink, tokens } from "@fluentui/react-components";
import { BookOpenRegular } from "@fluentui/react-icons";
import { makeStyles } from "@griffel/react";
import Link from "next/link";

const useStyles = makeStyles({
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "700",
    fontSize: "20px",
    color: tokens.colorBrandBackground,
    textDecoration: "none",
    transition: "transform 0.2s ease",
    textWrap: "nowrap",
    ":hover": {
      transform: "scale(1.02)",
    },
  },
  logoIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    backgroundColor: tokens.colorBrandBackground,
    color: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(146, 114, 230, 0.3)",
  },
  logoText: {
    background: tokens.colorBrandBackground,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  nextLink: {
    textDecoration: "none",
  },
});

export const Logo = () => {
  const styles = useStyles();
  return (
    <Link href="/recipes" passHref className={styles.nextLink}>
      <FluentLink className={styles.logo} style={{ textDecoration: "none" }}>
        <span className={styles.logoIcon}>
          <BookOpenRegular fontSize={18} />
        </span>
        <span className={styles.logoText}>Book Cook</span>
      </FluentLink>
    </Link>
  );
};
