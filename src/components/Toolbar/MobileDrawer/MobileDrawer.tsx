import * as React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Divider,
  mergeClasses,
  Text,
} from "@fluentui/react-components";
import { Add24Regular, Dismiss24Regular } from "@fluentui/react-icons";
import { SearchBar } from "../SearchBar";
import { useMobileDrawerStyles } from "./MobileDrawer.styles";
import type { MobileDrawerProps } from "./MobileDrawer.types";
import { navLinks } from "../constants";

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onOpenChange,
  currentPath,
  onNavigate,
}) => {
  const styles = useMobileDrawerStyles();

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(_, { open }) => onOpenChange(open)}
      position="end"
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Dismiss24Regular />}
              onClick={() => onOpenChange(false)}
              className={styles.drawerHeaderAction}
            />
          }
        >
          Menu
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody className={styles.mobileMenu}>
        <div className={styles.drawerContentWrapper}>
          <div className={styles.searchWrapper}>
            <SearchBar />
          </div>

          <div className={styles.navSection}>
            {navLinks.map((link) => (
              <Button
                key={link.url}
                appearance="subtle"
                className={mergeClasses(
                  styles.mobileNavLink,
                  currentPath === link.url && styles.activeLink
                )}
                onClick={() => {
                  onNavigate(link.url);
                  onOpenChange(false);
                }}
              >
                {link.label}
              </Button>
            ))}
          </div>
<<<<<<< HEAD

          <Divider />

=======
>>>>>>> e95f26bae90c1a6f8f00696f6a89fcfc9c0a8665
          <div className={styles.footerSection}>
            <Button
              appearance="primary"
              icon={<Add24Regular />}
              onClick={() => {
                onNavigate("/newRecipe");
                onOpenChange(false);
              }}
<<<<<<< HEAD
              className={styles.primaryActionButton}
=======
              className={styles.toolbarButton}
              style={{ marginTop: "16px" }}
>>>>>>> e95f26bae90c1a6f8f00696f6a89fcfc9c0a8665
            >
              New Recipe
            </Button>
          </div>
        </div>
      </DrawerBody>
    </Drawer>
  );
};
