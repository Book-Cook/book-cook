import * as React from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

import styles from "./meal-plan.module.css";
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

export default function MealPlanPage() {
  const { data: session } = useSession();

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
