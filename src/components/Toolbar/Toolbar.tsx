import * as React from "react";
import {
  Toolbar as ToolbarComponent,
  Link as FluentLink,
  Button,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { Add24Regular } from "@fluentui/react-icons";
import { makeStyles, shorthands } from "@griffel/react";
import { SearchBar } from "./SearchBar";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { UserProfile } from "./UserProfile";
import { Logo } from "./Logo";

const useToolbarStyles = makeStyles({
  root: {
    position: "sticky",
    top: "0px",
    height: "60px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    flexShrink: 0,
    zIndex: 10000,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)",
    ...shorthands.padding("0", "24px"),
    ...shorthands.borderRadius(0, 0, "8px", "8px"),
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  linkStyles: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none", // Base state
    gap: "8px",
    color: tokens.colorNeutralForeground1,
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "20px",
    position: "relative",
    ...shorthands.padding("8px", "14px"),
    ...shorthands.borderRadius("8px"),
    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",

    // Add subtle indicator for active links
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
      backgroundColor: "rgba(146, 114, 230, 0.08)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(146, 114, 230, 0.15)",
      textDecoration: "none",

      // Expand the indicator on hover
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
  navLinks: {
    display: "flex",
    gap: "8px",
    paddingLeft: "32px",
  },
  toolbarButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#ffffff",
    fontWeight: "500",
    fontSize: "14px",
    height: "36px",
    ...shorthands.padding("0", "20px"),
    ...shorthands.borderRadius("8px"),
    border: "none",
    boxShadow: "0 1px 3px rgba(105, 67, 209, 0.15)",
    transition: "all 0.2s ease",

    // Hover effects
    ":hover": {
      transform: "translateY(-1px)", // Subtle lift effect
      boxShadow: "0 4px 12px rgba(105, 67, 209, 0.25)", // More pronounced shadow
    },
  },
  nextLink: {
    textDecoration: "none",
  },
});

export const Toolbar = () => {
  const styles = useToolbarStyles();
  const router = useRouter();
  const { data: session } = useSession();
  const path = router.pathname;

  return (
    <ToolbarComponent className={styles.root}>
      <div className={styles.leftSection}>
        <Logo />
        {session?.user && (
          <div className={styles.navLinks}>
            <Link href="/recipes" className={styles.nextLink} passHref>
              <FluentLink
                className={mergeClasses(
                  styles.linkStyles,
                  path.includes("/recipes") && styles.activeLink
                )}
              >
                Recipes
              </FluentLink>
            </Link>
            <Link href="/collections" className={styles.nextLink} passHref>
              <FluentLink
                className={`${styles.linkStyles} ${path.includes("/collections") ? styles.activeLink : ""}`}
              >
                Collections
              </FluentLink>
            </Link>
            <Link href="/explore" className={styles.nextLink} passHref>
              <FluentLink
                className={`${styles.linkStyles} ${path.includes("/explore") ? styles.activeLink : ""}`}
              >
                Explore
              </FluentLink>
            </Link>
          </div>
        )}
      </div>
      <div className={styles.rightSection}>
        {session?.user && (
          <>
            <Button
              appearance="primary"
              icon={<Add24Regular />}
              onClick={() => router.push("/newRecipe")}
              className={styles.toolbarButton}
            >
              New Recipe
            </Button>
            <SearchBar />
          </>
        )}
        {session?.user ? (
          <UserProfile />
        ) : (
          <Button appearance="primary" onClick={() => signIn("google")}>
            Sign In
          </Button>
        )}
      </div>
    </ToolbarComponent>
  );
};
