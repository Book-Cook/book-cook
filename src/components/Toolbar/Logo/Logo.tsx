import * as React from "react";
import { BookOpenFilled } from "@fluentui/react-icons";
import Link from "next/link";

import styles from "./Logo.module.css";

export const Logo = () => {
  return (
    <Link href="/" className={styles.logoLink}>
      <span className={styles.logoIcon}>
        <BookOpenFilled />
      </span>
      <span className={styles.logoText}>Book Cook</span>
    </Link>
  );
};
