import * as React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useSession } from "next-auth/react";

import { Unauthorized } from "../components/FallbackScreens";
import { MealPlanCalendar } from "../components/MealPlan/MealPlanCalendar/MealPlanCalendar";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
});

export default function MealPlanPage() {
  const { data: session } = useSession();
  const styles = useStyles();

  if (!session) {
    return <Unauthorized />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <MealPlanCalendar />
      </div>
    </div>
  );
}