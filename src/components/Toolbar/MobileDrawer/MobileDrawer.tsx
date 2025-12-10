import * as React from "react";
import { Button, Divider } from "@fluentui/react-components";
import { Add24Regular, Dismiss24Regular } from "@fluentui/react-icons";

import clsx from "clsx";

import styles from "./MobileDrawer.module.css";
import type { MobileDrawerProps } from "./MobileDrawer.types";
import { navLinks } from "../constants";
import { SearchBar } from "../SearchBar";

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
} from "../../Drawer";

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
          <div>
            <SearchBar onSearch={() => onOpenChange(false)} />
          </div>

          <div className={styles.navSection}>
            {navLinks.map((link) => (
              <Button
                key={link.url}
                appearance="subtle"
                className={clsx(
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

          <Divider />

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
