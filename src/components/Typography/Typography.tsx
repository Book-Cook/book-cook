import * as React from "react";
import { clsx } from "clsx";

import styles from "./Typography.module.css";
import type { TextProps, TypographyProps } from "./Typography.types";

const variants = {
  recipeTitle: { style: styles.recipeTitle, tag: "h1" },
  pageTitle: { style: styles.pageTitle, tag: "h1" },
  sectionHeading: { style: styles.sectionHeading, tag: "h2" },
  subsectionHeading: { style: styles.subsectionHeading, tag: "h3" },
  focusStep: { style: styles.focusStep, tag: "p" },
  bodyText: { style: styles.bodyText, tag: "p" },
  metaLabel: { style: styles.metaLabel, tag: "span" },
} as const;

/**
 * A versatile Typography component for rendering text with various styles and HTML elements.
 */
export const Text: React.FC<TextProps> = (props) => {
  const {
    variant = "bodyText",
    as,
    className,
    bold,
    italic,
    underline,
    strikethrough,
    ...rest
  } = props;

  const config = variants[variant];
  const Component = as ?? config.tag;

  return (
    <Component
      className={clsx(
        config.style,
        bold && styles.bold,
        italic && styles.italic,
        underline && styles.underline,
        strikethrough && styles.strikethrough,
        className,
      )}
      {...rest}
    />
  );
};

export const RecipeTitle = (props: TypographyProps) => (
  <Text variant="recipeTitle" {...props} />
);
export const PageTitle = (props: TypographyProps) => (
  <Text variant="pageTitle" {...props} />
);
export const SectionHeading = (props: TypographyProps) => (
  <Text variant="sectionHeading" {...props} />
);
export const SubsectionHeading = (props: TypographyProps) => (
  <Text variant="subsectionHeading" {...props} />
);
export const FocusStep = (props: TypographyProps) => (
  <Text variant="focusStep" {...props} />
);
export const BodyText = (props: TypographyProps) => (
  <Text variant="bodyText" {...props} />
);
export const MetaLabel = (props: TypographyProps) => (
  <Text variant="metaLabel" {...props} />
);
