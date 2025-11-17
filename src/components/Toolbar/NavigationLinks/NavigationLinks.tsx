import * as React from "react";
import { Link as FluentLink, mergeClasses } from "@fluentui/react-components";
import Link from "next/link";

import { useNavigationStyles } from "./NavigationLInks.styles";
import type { NavigationLinksProps } from "./NavigationLinks.types";
import { navLinks } from "../constants";

const NavigationLinksComponent: React.FC<NavigationLinksProps> = ({
  currentPath,
}) => {
  const styles = useNavigationStyles();

  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.url}
          href={link.url}
          className={styles.nextLink}
          passHref
        >
          <FluentLink
            className={mergeClasses(
              styles.linkStyles,
              currentPath === link.url && styles.activeLink
            )}
          >
            {link.label}
          </FluentLink>
        </Link>
      ))}
    </>
  );
};

export const NavigationLinks = React.memo(NavigationLinksComponent);
