import * as React from "react";
import cx from "clsx";

import styles from "./Card.module.css";
import type { CardProps } from "./Card.types";

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      onClick,
      onKeyDown,
      role: roleProp,
      tabIndex: tabIndexProp,
      ...rest
    },
    ref
  ): React.ReactElement => {
    const isClickable = Boolean(onClick);
    const role = roleProp ?? (isClickable ? "button" : undefined);
    const tabIndex = tabIndexProp ?? (isClickable ? 0 : undefined);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (isClickable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
        }

        onKeyDown?.(event);
      },
      [isClickable, onClick, onKeyDown]
    );

    const shouldHandleKeyDown = isClickable || Boolean(onKeyDown);

    const cardClassName = cx(
      styles.card,
      isClickable && styles.clickable,
      className
    );

    return (
      <div
        ref={ref}
        className={cardClassName}
        onClick={onClick}
        role={role}
        tabIndex={tabIndex}
        onKeyDown={shouldHandleKeyDown ? handleKeyDown : undefined}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
