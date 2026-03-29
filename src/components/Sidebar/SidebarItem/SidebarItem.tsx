import type { CSSProperties } from "react";
import { forwardRef } from "react";
import { clsx } from "clsx";

import styles from "./SidebarItem.module.css";
import type { SidebarItemProps } from "./SidebarItem.types";
import { useSidebarContext } from "../SidebarContext";

import { Tooltip } from "../../Tooltip";
import { BodyText } from "../../Typography";

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    {
      icon,
      label,
      active,
      depth = 0,
      endAdornment,
      iconOnly = false,
      labelStacked = false,
      className,
      type,
      children,
      ...rest
    },
    ref
  ) => {
    const { collapsed } = useSidebarContext();
    const resolvedDepth = Math.max(0, depth);
    const indentStyle =
      resolvedDepth > 0
        ? ({ "--sidebar-item-indent": `${resolvedDepth * 14}px` } as
            CSSProperties)
        : undefined;

    const button = (
      <button
        ref={ref}
        type={type ?? "button"}
        className={clsx(styles.item, className)}
        style={indentStyle}
        data-collapsed={collapsed ? "true" : "false"}
        data-icon-only={iconOnly ? "true" : "false"}
        aria-label={collapsed || iconOnly ? label : undefined}
        aria-current={active ? "page" : undefined}
        {...rest}
      >
        <span className={styles.itemIcon} aria-hidden="true">
          {icon}
        </span>
        {!iconOnly && (
          <>
            {children ? (
              <span
                className={clsx(
                  styles.itemLabel,
                  labelStacked && styles.itemLabelStacked
                )}
                aria-hidden={collapsed}
                data-sidebar-collapsible="true"
              >
                {children}
              </span>
            ) : (
              <BodyText
                as="span"
                className={clsx(
                  styles.itemLabel,
                  labelStacked && styles.itemLabelStacked
                )}
                aria-hidden={collapsed}
                data-sidebar-collapsible="true"
              >
                {label}
              </BodyText>
            )}
            {endAdornment && (
              <span
                className={styles.itemEnd}
                aria-hidden={collapsed}
                data-sidebar-collapsible="true"
              >
                {endAdornment}
              </span>
            )}
          </>
        )}
      </button>
    );

    return (
      <Tooltip content={label} side="right" align="center" disabled={!collapsed}>
        {button}
      </Tooltip>
    );
  }
);

SidebarItem.displayName = "SidebarItem";
