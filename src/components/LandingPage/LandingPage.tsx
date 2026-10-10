import * as React from "react";
import { BookOpen } from "@phosphor-icons/react";
import { signIn } from "next-auth/react";

import styles from "./LandingPage.module.css";
import { GoogleSignInButton } from "../Auth/GoogleSignInButton";

const LandingPage = () => {
  const handleGoogle = () => {
    void signIn("google");
  };

  // data-theme re-scopes the design tokens, so the sign-in page stays light
  // even when the app (or the OS) is in dark mode.
  return (
    <div className={styles.page} data-theme="light">
      <div className={styles.card}>
        <div className={styles.logo}>
          <BookOpen weight="fill" size={22} color="#fff" />
        </div>
        <h1 className={styles.title}>Book Cook</h1>
        <p className={styles.subtitle}>
          Sign up or sign in to access your recipe gallery and editor.
        </p>
        <div className={styles.actions}>
          <GoogleSignInButton onClick={handleGoogle} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
