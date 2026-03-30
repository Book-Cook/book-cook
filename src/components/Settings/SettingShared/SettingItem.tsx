import * as React from "react";
import { clsx } from "clsx";

import styles from "./SettingItem.module.css";

export interface SettingItemProps {
  label: string;
  description: string;
  children: React.ReactNode;
  statusMessage?: {
    text: string;
    type: "success" | "error";
  };
  fullWidth?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  children,
  statusMessage,
  fullWidth = false,
}) => {
  return (
    <div
      className={clsx(
        styles.setting,
        fullWidth && styles.settingFullWidth
      )}
    >
      <div
        className={clsx(styles.info, fullWidth && styles.infoFullWidth)}
      >
        <div className={styles.label}>{label}</div>
        <div className={styles.description}>{description}</div>
        {statusMessage && (
          <div
            className={
              statusMessage.type === "success"
                ? "successMessage"
                : "errorMessage"
            }
          >
            {statusMessage.text}
          </div>
        )}
      </div>
      <div className={fullWidth ? styles.childrenFullWidth : styles.control}>
        {children}
      </div>
    </div>
  );
};
