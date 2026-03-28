import type { CSSProperties } from "react";
import { clsx } from "clsx";

import styles from "./SidebarSection.module.css";
import type { SidebarSectionProps } from "./SidebarSection.types";
import { useSidebarContext } from "../SidebarContext";
import { Accordion } from "../../Accordion";

export const SidebarSection = ({
  label,
  value,
  children,
  depth = 0,
  variant = "section",
  icon,
  endAdornment,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
  style,
}: SidebarSectionProps) => {
  const { getSectionOpen, setSectionOpen } = useSidebarContext();
  const resolvedDepth = Math.max(0, depth);
  const indentStyle =
    resolvedDepth > 0
      ? ({
          "--sidebar-section-indent": `${resolvedDepth * 14}px`,
        } as CSSProperties)
      : undefined;
  const sectionValue = value ?? label;
  const isControlled = typeof open === "boolean";
  const isItemVariant = variant === "item";
  const resolvedValue = isControlled ? (open ? sectionValue : "") : undefined;
  const storedOpen = isControlled ? undefined : getSectionOpen(sectionValue);
  const shouldBeOpen = storedOpen ?? defaultOpen;
  const resolvedDefaultValue =
    !isControlled && shouldBeOpen ? sectionValue : undefined;
  const title = isItemVariant ? (
    <>
      {icon && (
        <span className={styles.sectionIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.sectionText}>{label}</span>
      {endAdornment && (
        <span className={styles.sectionEnd} aria-hidden="true">
          {endAdornment}
        </span>
      )}
    </>
  ) : (
    label
  );
  const handleValueChange = (value: string | string[]) => {
    if (typeof value !== "string") {
      return;
    }
    const nextOpen = value === sectionValue;
    if (!isControlled) {
      setSectionOpen(sectionValue, nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <Accordion
      items={[
        {
          value: sectionValue,
          title,
          content: children,
        },
      ]}
      type="single"
      collapsible
      value={resolvedValue}
      defaultValue={resolvedDefaultValue}
      onValueChange={handleValueChange}
      className={clsx(styles.section, className)}
      triggerClassName={clsx(
        styles.sectionTrigger,
        isItemVariant && styles.sectionTriggerItem
      )}
      contentClassName={styles.sectionContent}
      data-sidebar-collapsible="true"
      style={{ ...style, ...indentStyle }}
    />
  );
};
