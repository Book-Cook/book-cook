import * as React from "react";
import {
  Toolbar as ToolbarComponent,
  Button,
} from "@fluentui/react-components";
import { Navigation24Regular } from "@fluentui/react-icons";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

import { Logo } from "./Logo";
import { NavigationLinks } from "./NavigationLinks";
import { NewRecipeButton } from "./NewRecipeButton";
import { SearchBar } from "./SearchBar";
import styles from "./Toolbar.module.css";
import { UserProfile } from "./UserProfile";

import { useMediaQuery } from "../../hooks";

const MobileDrawer = dynamic(() => import("./MobileDrawer"), {
  loading: () => null,
  ssr: false,
});
const NewRecipeDialog = dynamic(
  () => import("./NewRecipeDialog").then((mod) => mod.NewRecipeDialog),
  {
    ssr: false,
  }
);

export const Toolbar = () => {
  const router = useRouter();
  const path = router.asPath;

  const { data: session, status } = useSession();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const rawIsMobile = useMediaQuery("(max-width: 900px)");
  const isMobile = isHydrated && rawIsMobile;
  const isAuthenticated = Boolean(session?.user);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isNewRecipeDialogOpen, setIsNewRecipeDialogOpen] =
    React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleMenu = React.useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleNavigate = React.useCallback(
    async (url: string) => {
      await router.push(url);
      setIsMenuOpen(false);
    },
    [router]
  );

  const openNewRecipe = React.useCallback(() => {
    setIsNewRecipeDialogOpen(true);
  }, []);

  const showSearch = !path.startsWith("/recipes");

  if (status === "loading") {
    return (
      <ToolbarComponent className={styles.root}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <Logo />
          </div>
        </div>
      </ToolbarComponent>
    );
  }

  if (!isAuthenticated) {
    return (
      <ToolbarComponent className={styles.root}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <Logo />
          </div>
          <div className={styles.rightSection}>
            <Button appearance="primary" onClick={() => signIn("google")}>
              Sign In
            </Button>
          </div>
        </div>
      </ToolbarComponent>
    );
  }

  return (
    <>
      {isNewRecipeDialogOpen && (
        <NewRecipeDialog
          isOpen
          onClose={() => {
            setIsNewRecipeDialogOpen(false);
          }}
        />
      )}
      <ToolbarComponent className={styles.root}>
        <div className={styles.content}>
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
            <div className={styles.navLinks}>
              <NavigationLinks currentPath={router.pathname} />
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.newRecipeButton}>
              <NewRecipeButton onClick={openNewRecipe} />
            </div>
            {showSearch && (
              <div className={styles.searchBarWrapper}>
                <SearchBar />
              </div>
            )}
            <UserProfile />
          </div>
        </div>
      </ToolbarComponent>
      {isMobile && (
        <MobileDrawer
          isOpen={isMenuOpen}
          onNewRecipeDialogOpen={openNewRecipe}
          onOpenChange={setIsMenuOpen}
          currentPath={router.pathname}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
};
