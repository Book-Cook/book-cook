import * as React from "react";
import { tokens, mergeClasses } from "@fluentui/react-components";
import { makeStyles } from "@griffel/react";

const useStyles = makeStyles({
  setting: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  settingFullWidth: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  childrenFullWidth: {
    width: "100%",
  },
  info: {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoFullWidth: {
    flex: "1 1 auto",
  },
  label: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  description: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  control: {
    width: "250px",
    flexShrink: 0,
    "@media (max-width: 710px)": {
      width: "100%",
    },
  },
});

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
  const styles = useStyles();

  return (
    <div
      className={mergeClasses(
        styles.setting,
        fullWidth && styles.settingFullWidth
      )}
    >
      <div
        className={mergeClasses(styles.info, fullWidth && styles.infoFullWidth)}
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
