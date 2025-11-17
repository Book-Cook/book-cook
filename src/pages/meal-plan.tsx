import * as React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

import { Unauthorized } from "../components/FallbackScreens";

const MealPlanCalendar = dynamic(
  () =>
    import("../components/MealPlan/MealPlanCalendar/MealPlanCalendar").then(
      (mod) => mod.MealPlanCalendar
    ),
  {
    loading: () => null,
    ssr: false,
  }
);

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 60px)", // Subtract toolbar height
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