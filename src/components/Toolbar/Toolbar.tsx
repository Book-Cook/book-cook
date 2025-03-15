import * as React from "react";
import {
  Toolbar as ToolbarComponent,
  Button,
  Drawer,
  DrawerBody,
} from "@fluentui/react-components";
import {
  Add24Regular,
  Dismiss24Regular,
  Navigation24Regular,
} from "@fluentui/react-icons";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { UserProfile } from "./UserProfile";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { NavigationLinks } from "./NavigationLinks";
import { MobileDrawer } from "./MobileDrawer";
import { useMediaQuery } from "../../hooks";
import { useToolbarStyles } from "./Toolbar.styles";

export const Toolbar = () => {
  const styles = useToolbarStyles();
  const router = useRouter();
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNewRecipe = () => router.push("/newRecipe");

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
            <div className={styles.navLinks}>
              <NavigationLinks currentPath={router.pathname} />
            </div>
          )}
        </div>
        <div className={styles.rightSection}>
          {session?.user && (
            <>
              <Button
                appearance="primary"
                icon={<Add24Regular />}
                onClick={handleNewRecipe}
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
        <MobileDrawer
          isOpen={isMenuOpen}
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
