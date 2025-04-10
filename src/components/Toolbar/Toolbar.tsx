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
import { NewRecipeDialog } from "./NewRecipeDialog";
import { SearchBar } from "./SearchBar";
import { useToolbarStyles } from "./Toolbar.styles";
import { UserProfile } from "./UserProfile";

import { useMediaQuery } from "../../hooks";

const MobileDrawer = dynamic(() => import("./MobileDrawer"), {
  loading: () => null,
  ssr: false,
});

export const Toolbar = () => {
  const styles = useToolbarStyles();
  const router = useRouter();
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isNewRecipeDialogOpen, setIsNewRecipeDialogOpen] =
    React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <NewRecipeDialog
        isOpen={isNewRecipeDialogOpen}
        onClose={() => {
          setIsNewRecipeDialogOpen(false);
        }}
      />
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
            <div className={styles.navLinks}>
              <NavigationLinks currentPath={router.pathname} />
            </div>
          )}
        </div>
        <div className={styles.rightSection}>
          {session?.user && (
            <>
              <NewRecipeButton onClick={() => setIsNewRecipeDialogOpen(true)} />
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
        <MobileDrawer
          isOpen={isMenuOpen}
          onNewRecipeDialogOpen={() => setIsNewRecipeDialogOpen(true)}
          onOpenChange={setIsMenuOpen}
          currentPath={router.pathname}
          onNavigate={(url) => {
            router.push(url);
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
};
