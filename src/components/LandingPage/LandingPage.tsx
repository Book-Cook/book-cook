import * as React from "react";
import { signIn } from "next-auth/react";
import { GoogleSignInButton } from "../Auth/GoogleSignInButton";

import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const handleGoogle = () => {
    signIn("google");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
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
