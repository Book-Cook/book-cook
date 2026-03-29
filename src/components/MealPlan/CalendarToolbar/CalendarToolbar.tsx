import * as React from "react";
import { CalendarCheckIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

import styles from "./CalendarToolbar.module.css";
import type { CalendarView } from "../MealPlanCalendar/MealPlanCalendar.types";

import { Button } from "../../Button";
import { Text } from "../../Text";

interface CalendarToolbarProps {
  view: CalendarView;
  currentDate: Date;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = React.memo(
  function CalendarToolbar({
    view,
    currentDate,
    onViewChange,
    onPrevious,
    onNext,
    onToday,
  }) {
    const formatDateDisplay = () => {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
      };

      if (view === "day") {
        options.day = "numeric";
        options.weekday = "long";
      } else if (view === "week") {
        const start = new Date(currentDate);
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);

        return `${start.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${end.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      }

      return currentDate.toLocaleDateString("en-US", options);
    };

    return (
      <div className={styles.viewControls}>
        <div className={styles.viewButtons}>
          <Button
            appearance={view === "day" ? "primary" : "subtle"}
            className={styles.viewButton}
            onClick={() => onViewChange("day")}
          >
            Day
          </Button>
          <Button
            appearance={view === "week" ? "primary" : "subtle"}
            className={styles.viewButton}
            onClick={() => onViewChange("week")}
          >
            Week
          </Button>
          <Button
            appearance={view === "month" ? "primary" : "subtle"}
            className={styles.viewButton}
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
        </div>

        <Text className={styles.dateDisplay}>{formatDateDisplay()}</Text>

        <div className={styles.navigationButtons}>
          <Button
            appearance="subtle"
            startIcon={<CaretLeftIcon size={16} />}
            onClick={onPrevious}
            title="Previous"
          />
          <Button
            appearance="subtle"
            startIcon={<CalendarCheckIcon size={16} />}
            onClick={onToday}
          >
            Today
          </Button>
          <Button
            appearance="subtle"
            startIcon={<CaretRightIcon size={16} />}
            onClick={onNext}
            title="Next"
          />
        </div>
      </div>
    );
  }
);
