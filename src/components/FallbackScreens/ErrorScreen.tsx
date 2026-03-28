import { WarningCircleIcon } from "@phosphor-icons/react";
import styles from "./FallbackScreens.module.css";

type ErrorScreenProps = {
  message?: string;
};

export const ErrorScreen = ({ message }: ErrorScreenProps) => {
  return (
    <div className={styles.container}>
      <WarningCircleIcon size={48} className={styles.icon} />
      <p className={styles.title}>Error</p>
      <p className={styles.body}>
        {message ?? "Something went wrong. Please try again."}
      </p>
    </div>
  );
};
