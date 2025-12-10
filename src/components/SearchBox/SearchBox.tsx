import * as React from "react";

import clsx from "clsx";

import styles from "./SearchBox.module.css";
import type { SearchBoxProps } from "./SearchBox.types";

export const SearchBox = React.forwardRef<HTMLInputElement, SearchBoxProps>(
  ({
    allowClear = true,
    className,
    onChange,
    value,
    defaultValue,
    contentBefore,
    contentAfter,
    ...rest
  },
  ref) => {
    const [internalValue, setInternalValue] = React.useState<string>(defaultValue?.toString() ?? "");

    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value as string) : internalValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onChange?.(event, event.target.value);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      if (ref && typeof ref !== "function") {
        ref.current?.focus();
      }
      onChange?.({} as React.ChangeEvent<HTMLInputElement>, "");
    };

    const showClear = allowClear && !contentAfter && Boolean(currentValue);

    const classes = clsx(
      styles.input,
      contentBefore && styles.withContentBefore,
      className
    );

    return (
      <div className={styles.root}>
        {contentBefore ? <span className={styles.contentBefore}>{contentBefore}</span> : null}
        <input
          ref={ref}
          className={classes}
          type="search"
          value={currentValue}
          onChange={handleChange}
          {...rest}
        />
        {contentAfter ? <span className={styles.contentAfter}>{contentAfter}</span> : null}
        {showClear && (
          <button type="button" className={styles.clearButton} onClick={handleClear} aria-label="Clear">
            ×
          </button>
        )}
      </div>
    );
  }
);

SearchBox.displayName = "SearchBox";
