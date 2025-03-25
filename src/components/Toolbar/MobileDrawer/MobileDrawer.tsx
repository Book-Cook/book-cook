import * as React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
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
      <DrawerBody className={styles.mobileMenu}>
        <Button
          appearance="subtle"
          icon={<Dismiss24Regular />}
          onClick={() => onOpenChange(false)}
          className={styles.mobileMenuButton}
          aria-label="Close menu"
        />
        <div className={styles.drawerContent}>
          <div className={styles.drawerHeader}>
            <Text className={styles.drawerTitle}>Menu</Text>
            <div className={styles.searchWrapper}>
              <SearchBar />
            </div>
          </div>
          <div className={styles.divider} />
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
          <div className={styles.footerSection}>
            <Button
              appearance="primary"
              icon={<Add24Regular />}
              onClick={() => {
                onNavigate("/newRecipe");
                onOpenChange(false);
              }}
              className={styles.toolbarButton}
              style={{ marginTop: "16px" }}
            >
              New Recipe
            </Button>
          </div>
        </div>
      </DrawerBody>
    </Drawer>
  );
};
