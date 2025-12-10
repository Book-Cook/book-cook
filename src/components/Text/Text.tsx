import * as React from "react";

import clsx from "clsx";

import styles from "./Text.module.css";
import type {
  TextProps,
  TextSize,
  TextVariant,
  TextWeight,
} from "./Text.types";

const sizeClassMap: Record<TextSize, string> = {
  200: styles.size200,
  300: styles.size300,
  400: styles.size400,
  500: styles.size500,
  600: styles.size600,
  700: styles.size700,
  800: styles.size800,
};

const weightClassMap: Record<TextWeight, string> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

const variantDefaults: Record<
  TextVariant,
  { size: TextSize; weight: TextWeight; as: React.ElementType }
> = {
  caption: { size: 200, weight: "regular", as: "span" },
  body2: { size: 200, weight: "regular", as: "span" },
  body1: { size: 300, weight: "regular", as: "p" },
  subtitle2: { size: 400, weight: "medium", as: "p" },
  subtitle1: { size: 500, weight: "medium", as: "p" },
  heading3: { size: 600, weight: "semibold", as: "h3" },
  heading2: { size: 700, weight: "semibold", as: "h2" },
  heading1: { size: 800, weight: "bold", as: "h1" },
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as,
      size = 300,
      weight = "regular",
      italic = false,
      block = false,
      truncate = false,
      variant,
      className,
      children,
      ...rest
    },
    ref
  ): React.ReactElement => {
    const variantDefaultsOverride = variant
      ? variantDefaults[variant]
      : undefined;

    const Component =
      as ?? (variantDefaultsOverride ? variantDefaultsOverride.as : "span");
    const resolvedSize = variantDefaultsOverride?.size ?? size;
    const resolvedWeight = variantDefaultsOverride?.weight ?? weight;

    const classNames = clsx(
      styles.base,
      sizeClassMap[resolvedSize],
      weightClassMap[resolvedWeight],
      italic && styles.italic,
      block && styles.block,
      truncate && styles.truncate,
      className
    );

    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={classNames}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";

export const Heading1 = React.forwardRef<
  HTMLElement,
  Omit<TextProps, "variant">
>((props, ref) => <Text ref={ref} variant="heading1" {...props} />);
Heading1.displayName = "Heading1";

export const Heading2 = React.forwardRef<
  HTMLElement,
  Omit<TextProps, "variant">
>((props, ref) => <Text ref={ref} variant="heading2" {...props} />);
Heading2.displayName = "Heading2";

export const Heading3 = React.forwardRef<
  HTMLElement,
  Omit<TextProps, "variant">
>((props, ref) => <Text ref={ref} variant="heading3" {...props} />);
Heading3.displayName = "Heading3";

export const Subtitle1 = React.forwardRef<
  HTMLElement,
  Omit<TextProps, "variant">
>((props, ref) => <Text ref={ref} variant="subtitle1" {...props} />);
Subtitle1.displayName = "Subtitle1";

export const Subtitle2 = React.forwardRef<
  HTMLElement,
  Omit<TextProps, "variant">
>((props, ref) => <Text ref={ref} variant="subtitle2" {...props} />);
Subtitle2.displayName = "Subtitle2";

export const Body1 = React.forwardRef<HTMLElement, Omit<TextProps, "variant">>(
  (props, ref) => <Text ref={ref} variant="body1" {...props} />
);
Body1.displayName = "Body1";

export const Body2 = React.forwardRef<HTMLElement, Omit<TextProps, "variant">>(
  (props, ref) => <Text ref={ref} variant="body2" {...props} />
);
Body2.displayName = "Body2";

export const Caption = React.forwardRef<
  HTMLElement,
  Omit<TextProps, "variant">
>((props, ref) => <Text ref={ref} variant="caption" {...props} />);
Caption.displayName = "Caption";
