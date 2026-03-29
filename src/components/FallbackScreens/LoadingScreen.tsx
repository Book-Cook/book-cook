import * as React from "react";

import styles from "./LoadingScreen.module.css";

export const LoadingScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} role="status" aria-label="Loading" />
    </div>
  );
};
