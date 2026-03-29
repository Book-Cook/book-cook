import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import styles from "./SettingsSection.module.css";

export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  itemValue: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  children,
  itemValue,
  title,
  icon,
}) => {
  // Process children to add dividers between them
  const childrenWithDividers = React.Children.toArray(children)
    .filter(Boolean)
    .flatMap((child, index, array) => {
      if (index === array.length - 1) {
        return [child];
      }
      return [child, <hr key={`divider-${index}`} className={styles.divider} />];
    });

  return (
    <AccordionPrimitive.Item value={itemValue} className={styles.accordionItem}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className={styles.accordionTrigger}>
          <span className={styles.icon}>{icon}</span>
          <span className={styles.title}>{title}</span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className={styles.accordionContent}>
        <section className={styles.section}>{childrenWithDividers}</section>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
};
