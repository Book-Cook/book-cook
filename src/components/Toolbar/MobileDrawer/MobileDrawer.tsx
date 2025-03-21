import * as React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  mergeClasses,
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
      size="small"
    >
      <DrawerBody className={styles.mobileMenu}>
        <Button
          appearance="subtle"
          icon={<Dismiss24Regular />}
          onClick={() => onOpenChange(false)}
          className={styles.mobileMenuButton}
          aria-label="Close menu"
        />

        <div className={styles.navSection}>
          {navLinks.map((link) => (
            <Button
              key={link.url}
              appearance="subtle"
              className={mergeClasses(
                styles.mobileNavLink,
                currentPath.includes(link.url) && styles.activeLink
              )}
              onClick={() => onNavigate(link.url)}
            >
              {link.label}
            </Button>
          ))}
        </div>

        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => onNavigate("/newRecipe")}
          className={styles.toolbarButton}
        >
          New Recipe
        </Button>

        <div className={styles.searchBarWrapper}>
          <SearchBar />
        </div>
      </DrawerBody>
    </Drawer>
  );
};
