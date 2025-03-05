import * as React from "react";
import {
  Toolbar as ToolbarComponent,
  Link as FluentLink,
  Button,
  Avatar,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuDivider,
  tokens,
} from "@fluentui/react-components";
import {
  BookOpenRegular,
  PersonCircleRegular,
  SettingsRegular,
  Add24Regular,
  CollectionsRegular,
} from "@fluentui/react-icons";
import { LargeTitle } from "../";
import { makeStyles, shorthands } from "@griffel/react";
import { SearchBar } from "./SearchBar";
import { useRouter } from "next/router";
import Link from "next/link";

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
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: "600",
    textDecoration: "none",
    ":after": {
      content: "''",
      position: "absolute",
      bottom: "-4px",
      left: "30%",
      right: "30%",
      height: "3px",
      backgroundColor: tokens.colorBrandBackground,
      borderRadius: "1.5px",
      boxShadow: "0 1px 2px rgba(105, 67, 209, 0.3)",
    },
  },
  linkIcon: {
    display: "flex",
    fontSize: "16px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "700",
    fontSize: "20px",
    color: tokens.colorBrandBackground,
    textDecoration: "none",
    transition: "transform 0.2s ease",
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
  navLinks: {
    display: "flex",
    gap: "8px",
    paddingLeft: "32px",
  },
  iconButton: {
    ...shorthands.borderRadius("8px"),
    width: "40px",
    height: "40px",
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground2,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      color: tokens.colorBrandForeground1,
    },
    transition: "all 0.2s ease",
  },
  avatarButton: {
    cursor: "pointer",
    ":hover": {
      opacity: 0.8,
    },
    transition: "transform 0.2s ease",
  },
  newRecipeButton: {
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

  logoText: {
    background: tokens.colorBrandBackground,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  nextLink: {
    textDecoration: "none",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  menuIcon: {
    display: "flex",
    fontSize: "16px",
  },
});

export const Toolbar = () => {
  const styles = useToolbarStyles();
  const router = useRouter();
  const path = router.pathname;

  return (
    <ToolbarComponent className={styles.root}>
      <div className={styles.leftSection}>
        <Link href="/" passHref className={styles.nextLink}>
          <FluentLink
            className={styles.logo}
            style={{ textDecoration: "none" }}
          >
            <span className={styles.logoIcon}>
              <BookOpenRegular fontSize={18} />
            </span>
            <span className={styles.logoText}>Book Cook</span>
          </FluentLink>
        </Link>

        <div className={styles.navLinks}>
          <Link href="/recipes" className={styles.nextLink} passHref>
            <FluentLink
              className={`${styles.linkStyles} ${path.includes("/recipes") ? styles.activeLink : ""}`}
            >
              Recipes
            </FluentLink>
          </Link>
          {/*
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
          </Link> */}
        </div>
      </div>
      <div className={styles.rightSection}>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => router.push("/newRecipe")}
          className={styles.newRecipeButton}
        >
          New Recipe
        </Button>
        <SearchBar />
        {/* <Tooltip content="Settings" relationship="label">
          <Button className={styles.iconButton}>
            <SettingsRegular fontSize={20} />
          </Button>
        </Tooltip>
        <Tooltip content="Profile" relationship="label">
          <Avatar
            name="CZ"
            size={36}
            color="brand"
            className={styles.avatarButton}
          />
        </Tooltip> */}
      </div>
    </ToolbarComponent>
  );
};
