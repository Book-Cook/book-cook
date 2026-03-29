import * as React from "react";
import { clsx } from "clsx";

import styles from "./Tag.module.css";
import type { TagContentProps, TagProps } from "./Tag.types";
import { BodyText } from "../Typography";

const TagContent = ({
  children,
  startIcon,
  startIconAriaLabel,
  endIcon,
  onEndIconClick,
  endIconAriaLabel,
  interactive,
}: TagContentProps) => {
  const handleEndIconClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (interactive) {
      event.stopPropagation();
    }
    onEndIconClick?.(event);
  };

  const endIconClickable = interactive || Boolean(onEndIconClick);

  return (
    <>
      {startIcon && (
        <span
          className={styles.startIcon}
          aria-label={startIconAriaLabel}
          role={startIconAriaLabel ? "img" : undefined}
          aria-hidden={startIconAriaLabel ? undefined : true}
        >
          {startIcon}
        </span>
      )}
      <BodyText as="span" className={styles.text}>
        {children}
      </BodyText>
      {endIcon && (
        <span
          role={onEndIconClick ? "button" : undefined}
          aria-label={endIconAriaLabel}
          className={styles.endIcon}
          onClick={endIconClickable ? handleEndIconClick : undefined}
        >
          {endIcon}
        </span>
      )}
    </>
  );
};

export const Tag = ({
  children,
  onClick,
  startIcon,
  startIconAriaLabel,
  endIcon,
  onEndIconClick,
  endIconAriaLabel,
  className,
}: TagProps) => {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={clsx(styles.tag, styles.interactive, className)}
      >
        <TagContent
          interactive
          startIcon={startIcon}
          startIconAriaLabel={startIconAriaLabel}
          endIcon={endIcon}
          onEndIconClick={onEndIconClick}
          endIconAriaLabel={endIconAriaLabel}
        >
          {children}
        </TagContent>
      </button>
    );
  }

  return (
    <span className={clsx(styles.tag, className)}>
      <TagContent
        interactive={false}
        startIcon={startIcon}
        startIconAriaLabel={startIconAriaLabel}
        endIcon={endIcon}
        onEndIconClick={onEndIconClick}
        endIconAriaLabel={endIconAriaLabel}
      >
        {children}
      </TagContent>
    </span>
  );
};
