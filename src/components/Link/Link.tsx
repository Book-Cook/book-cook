import * as React from "react";
import cx from "clsx";
import NextLink from "next/link";


import styles from "./Link.module.css";
import type { LinkProps, LinkTone, LinkUnderline } from "./Link.types";

const underlineClassMap: Record<LinkUnderline, string> = {
  hover: styles.underlineHover,
  always: styles.underlineAlways,
  none: styles.underlineNone,
};

const toneClassMap: Record<LinkTone, string> = {
  default: "",
  muted: styles.muted,
};

const isExternalHref = (href: string): boolean =>
  /^https?:\/\//i.test(href) ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:");

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      underline = "hover",
      tone = "default",
      className,
      children,
      target,
      rel,
      ...rest
    },
    ref
  ) => {
    const classes = cx(
      styles.link,
      underlineClassMap[underline],
      toneClassMap[tone],
      className
    );

    const safeRel = target === "_blank" ? (rel ?? "noreferrer noopener") : rel;

    const anchor = (
      <a
        ref={ref}
        className={classes}
        href={href}
        target={target}
        rel={safeRel}
        {...rest}
      >
        {children}
      </a>
    );

    return isExternalHref(href) ? (
      anchor
    ) : (
      <NextLink href={href} passHref legacyBehavior>
        {anchor}
      </NextLink>
    );
  }
);

Link.displayName = "Link";
