import * as React from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import * as Accordion from "@radix-ui/react-accordion";

import styles from "./Settings.module.css";

export function SettingItem({
  label,
  description,
  children,
  fullWidth = false,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}): React.ReactElement {
  return (
    <div
      className={`${styles.settingItem} ${fullWidth ? styles.settingItemFullWidth : ""}`}
    >
      <div className={styles.settingInfo}>
        <div className={styles.settingLabel}>{label}</div>
        <div className={styles.settingDescription}>{description}</div>
      </div>
      <div
        className={
          fullWidth ? styles.settingControlFullWidth : styles.settingControl
        }
      >
        {children}
      </div>
    </div>
  );
}

export function Section({
  value,
  title,
  icon,
  children,
}: {
  value: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <Accordion.Item value={value} className={styles.accordionItem}>
      <Accordion.Header>
        <Accordion.Trigger className={styles.accordionTrigger}>
          <span className={styles.triggerIcon}>{icon}</span>
          <span className={styles.triggerLabel}>{title}</span>
          <CaretDownIcon size={14} className={styles.chevron} aria-hidden />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className={styles.accordionContent}>
        <div className={styles.accordionInner}>{children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
