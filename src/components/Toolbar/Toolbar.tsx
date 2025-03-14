import * as React from "react";
import {
  Toolbar as ToolbarComponent,
  Link as FluentLink,
  Button,
  mergeClasses,
  tokens,
  Drawer,
  DrawerBody,
} from "@fluentui/react-components";
import {
  Add24Regular,
  Dismiss24Regular,
  Navigation24Regular,
} from "@fluentui/react-icons";
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
    "@media (max-width: 768px)": {
      gap: "8px",
    },
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
    "@media (max-width: 768px)": {
      display: "none", // Hide on mobile
    },
  },
  hamburgerButton: {
    display: "none", // Hidden by default on desktop
    "@media (max-width: 768px)": {
      display: "flex",
    },
  },
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
    "@media (max-width: 768px)": {
      display: "none",
    },
    // Hover effects
    ":hover": {
      transform: "translateY(-1px)", // Subtle lift effect
      boxShadow: "0 4px 12px rgba(105, 67, 209, 0.25)", // More pronounced shadow
    },
  },
  nextLink: {
    textDecoration: "none",
  },
  searchBarWrapper: {
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
});

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  // Return false during SSR
  if (typeof window === "undefined") return false;
  return matches;
};

export const Toolbar = () => {
  const styles = useToolbarStyles();
  const router = useRouter();
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const path = router.pathname;

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (url: string) => {
    router.push(url);
    setIsMenuOpen(false);
  };

  return (
    <>
      <ToolbarComponent className={styles.root}>
        {isMobile && (
          <Button
            icon={<Navigation24Regular />}
            appearance="subtle"
            className={styles.hamburgerButton}
            onClick={toggleMenu}
            aria-label="Menu"
          />
        )}
        <div className={styles.leftSection}>
          <Logo />
          {session?.user && (
            <>
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
            </>
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
              <div className={styles.searchBarWrapper}>
                <SearchBar />
              </div>
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
      {session?.user && (
        <Drawer
          open={isMenuOpen}
          onOpenChange={(_, { open }) => setIsMenuOpen(open)}
          position="end"
        >
          <DrawerBody className={styles.mobileMenu}>
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={toggleMenu}
              className={styles.mobileMenuButton}
              aria-label="Close menu"
            />

            <Button
              appearance="subtle"
              className={mergeClasses(
                styles.mobileNavLink,
                path.includes("/recipes") && styles.activeLink
              )}
              onClick={() => handleNavigation("/recipes")}
            >
              Recipes
            </Button>

            <Button
              appearance="subtle"
              className={mergeClasses(
                styles.mobileNavLink,
                path.includes("/collections") && styles.activeLink
              )}
              onClick={() => handleNavigation("/collections")}
            >
              Collections
            </Button>

            <Button
              appearance="subtle"
              className={mergeClasses(
                styles.mobileNavLink,
                path.includes("/explore") && styles.activeLink
              )}
              onClick={() => handleNavigation("/explore")}
            >
              Explore
            </Button>

            <Button
              appearance="primary"
              icon={<Add24Regular />}
              onClick={() => handleNavigation("/newRecipe")}
              className={styles.toolbarButton}
            >
              New Recipe
            </Button>

            <SearchBar />
          </DrawerBody>
        </Drawer>
      )}
    </>
  );
};
