import * as React from "react";

import styles from "./Toolbar.module.css";

/**
 * Top navigation toolbar.
 * Wraps navigation links, search, and user profile actions.
 */
export const Toolbar: React.FC = () => {
  return (
    <nav className={styles.root}>
      <div className={styles.content}>
        <div className={styles.leftSection} />
        <div className={styles.rightSection} />
      </div>
    </nav>
  );
};
