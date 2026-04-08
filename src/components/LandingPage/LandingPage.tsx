import * as React from "react";
import { BookOpen } from "@phosphor-icons/react";
import { signIn } from "next-auth/react";

import styles from "./LandingPage.module.css";
import { GoogleSignInButton } from "../Auth/GoogleSignInButton";

const LandingPage = () => {
  const handleGoogle = () => {
    void signIn("google");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <BookOpen weight="fill" size={22} color="#fff" />
        </div>
        <h1 className={styles.title}>Book Cook</h1>
        <p className={styles.subtitle}>
          Sign in to access your recipe gallery and editor.
        </p>
        <div className={styles.actions}>
          <GoogleSignInButton onClick={handleGoogle} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
