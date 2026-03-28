import { ArchiveIcon } from "@phosphor-icons/react";
import styles from "./FallbackScreens.module.css";

export const NoDataScreen = () => {
  return (
    <div className={styles.container}>
      <ArchiveIcon size={48} className={styles.icon} />
      <p className={styles.title}>No data available</p>
      <p className={styles.body}>Nothing to show here yet.</p>
    </div>
  );
};
