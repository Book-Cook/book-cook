import * as React from "react";
import { makeStyles } from "@griffel/react";
import { tokens, Divider } from "@fluentui/react-components";

const useStyles = makeStyles({
  setting: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  info: {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
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
  showDivider?: boolean;
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
  showDivider = false,
  children,
  statusMessage,
  fullWidth = false,
}) => {
  const styles = useStyles();

  return (
    <>
      <div
        className={styles.setting}
        style={
          fullWidth ? { flexDirection: "column", alignItems: "flex-start" } : {}
        }
      >
        <div className={styles.info}>
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
        <div className={fullWidth ? { width: "100%" } : styles.control}>
          {children}
        </div>
      </div>
      {showDivider && <Divider />}
    </>
  );
};
