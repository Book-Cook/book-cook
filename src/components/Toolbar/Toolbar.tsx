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
  { loading: () => null }
);

export const Toolbar = () => {
  const router = useRouter();
  const path = router.asPath;

  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isNewRecipeDialogOpen, setIsNewRecipeDialogOpen] =
    React.useState(false);

  const toggleMenu = React.useCallback(
    () => setIsMenuOpen((prev) => !prev),
    []
  );

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
          {isAuthenticated && (
            <div className={styles.navLinks}>
              <NavigationLinks currentPath={router.pathname} />
            </div>
          )}
        </div>
        <div className={styles.rightSection}>
          {isAuthenticated && (
            <>
              <NewRecipeButton onClick={() => setIsNewRecipeDialogOpen(true)} />
              {path !== "/recipes" && (
                <div className={styles.searchBarWrapper}>
                  <SearchBar />
                </div>
              )}
            </>
          )}
          {isAuthenticated ? (
            <UserProfile />
          ) : (
            <Button appearance="primary" onClick={() => signIn("google")}>
              Sign In
            </Button>
          )}
        </div>
      </ToolbarComponent>
      {isAuthenticated && (
        <MobileDrawer
          isOpen={isMenuOpen}
          onNewRecipeDialogOpen={() => setIsNewRecipeDialogOpen(true)}
          onOpenChange={setIsMenuOpen}
          currentPath={router.pathname}
          onNavigate={async (url) => {
            await router.push(url);
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
};
