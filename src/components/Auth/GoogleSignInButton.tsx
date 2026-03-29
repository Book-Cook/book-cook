import { clsx } from "clsx";
import Image from "next/image";

import styles from "./GoogleSignInButton.module.css";
import type { GoogleSignInButtonProps } from "./GoogleSignInButton.types";
import { Button } from "../Button";

export const GoogleSignInButton = ({
  isLoading = false,
  onClick,
  className,
}: GoogleSignInButtonProps) => (
  <Button
    type="button"
    variant="secondary"
    startIcon={
      <Image
        src="/google-logo.svg"
        alt=""
        width={18}
        height={18}
        aria-hidden
        priority
      />
    }
    isLoading={isLoading}
    onClick={onClick}
    className={clsx(styles.button, className)}
  >
    {isLoading ? "Redirecting…" : "Continue with Google"}
  </Button>
);
