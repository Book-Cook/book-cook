import { CaretDownIcon } from "@phosphor-icons/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { clsx } from "clsx";

import styles from "./Accordion.module.css";
import type { AccordionProps } from "./Accordion.types";

const AccordionItems = ({
  items,
  itemClassName,
  triggerClassName,
  contentClassName,
}: Pick<AccordionProps, "items" | "itemClassName" | "triggerClassName" | "contentClassName">) =>
  items.map((item) => (
    <AccordionPrimitive.Item
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      className={clsx(styles.item, itemClassName)}
    >
      <AccordionPrimitive.Header className={styles.header}>
        <AccordionPrimitive.Trigger
          className={clsx(styles.trigger, triggerClassName)}
        >
          <span className={styles.label}>{item.title}</span>
          <CaretDownIcon
            className={styles.indicator}
            size={16}
            aria-hidden="true"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={clsx(styles.content, contentClassName)}
      >
        <div className={styles.contentInner}>{item.content}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  ));

export const Accordion = ({
  items,
  type = "single",
  collapsible = true,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  ...rootProps
}: AccordionProps) => {
  const sharedProps = { className: clsx(styles.accordion, className) };
  const itemProps = { items, itemClassName, triggerClassName, contentClassName };

  if (type === "multiple") {
    return (
      <AccordionPrimitive.Root type="multiple" {...sharedProps} {...(rootProps as object)}>
        <AccordionItems {...itemProps} />
      </AccordionPrimitive.Root>
    );
  }

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible={collapsible}
      {...sharedProps}
      {...(rootProps as object)}
    >
      <AccordionItems {...itemProps} />
    </AccordionPrimitive.Root>
  );
};
