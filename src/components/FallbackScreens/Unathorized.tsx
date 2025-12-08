import * as React from "react";
import { Title2, Body1, tokens } from "@fluentui/react-components";
import { LockClosed24Regular } from "@fluentui/react-icons";
import { makeStyles, shorthands } from "@griffel/react";
import { signIn } from "next-auth/react";

import { Button } from "../Button";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    textAlign: "center",
    ...shorthands.gap("16px"),
    ...shorthands.padding("40px", "20px"),
  },
  icon: {
    fontSize: "48px",
    color: tokens.colorNeutralForeground2,
    marginBottom: "16px",
  },
  actions: {
    marginTop: "24px",
  },
});

export const Unauthorized: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <LockClosed24Regular className={styles.icon} />
      <Title2>Access Restricted</Title2>
      <Body1>You need to be signed in to view your recipes</Body1>
      <div className={styles.actions}>
        <Button appearance="primary" onClick={() => signIn()}>
          Sign In
        </Button>
      </div>
    </div>
  );
};
