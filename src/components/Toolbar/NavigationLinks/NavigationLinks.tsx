import * as React from "react";
import cx from "clsx";

import styles from "./NavigationLinks.module.css";
import type { NavigationLinksProps } from "./NavigationLinks.types";
import { navLinks } from "../constants";

import { Link } from "../../Link";

export const NavigationLinks: React.FC<NavigationLinksProps> = ({ currentPath }) => {
  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.url}
          href={link.url}
          className={cx(
            styles.link,
            currentPath === link.url && styles.active
          )}
          underline="none"
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};
