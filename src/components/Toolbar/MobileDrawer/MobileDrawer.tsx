import * as React from "react";
import { Divider } from "@fluentui/react-components";
import { Add24Regular, Dismiss24Regular } from "@fluentui/react-icons";

import styles from "./MobileDrawer.module.css";
import type { MobileDrawerProps } from "./MobileDrawer.types";
import { navLinks } from "../constants";
import { SearchBar } from "../SearchBar";

import { Button } from "../../Button";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
} from "../../Drawer/Drawer";

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onOpenChange,
  currentPath,
  onNavigate,
  onNewRecipeDialogOpen,
}) => {
  const titleId = "mobile-drawer-title";

  return (
    <Drawer
      open={isOpen}
      ariaLabelledBy={titleId}
      onOpenChange={(_, { open }) => onOpenChange(open)}
      position="start"
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          id={titleId}
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
          <div className={styles.navSection}>
            {navLinks.map((link) => {
              const linkClassName = [
                styles.mobileNavLink,
                currentPath === link.url ? styles.activeLink : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <Button
                  key={link.url}
                  appearance="subtle"
                  className={linkClassName}
                  onClick={() => {
                    onNavigate(link.url);
                    onOpenChange(false);
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </div>
          <div className={styles.searchWrapper}>
            <SearchBar onSearch={() => onOpenChange(false)} />
          </div>
          <div className={styles.footerSection}>
            <Button
              appearance="primary"
              icon={<Add24Regular />}
              onClick={() => {
                onNewRecipeDialogOpen();
                onOpenChange(false);
              }}
              className={styles.primaryActionButton}
            >
              New Recipe
            </Button>
          </div>
        </div>
      </DrawerBody>
    </Drawer>
  );
};

export default MobileDrawer;
