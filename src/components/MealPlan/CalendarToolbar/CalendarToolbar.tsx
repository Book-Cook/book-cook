import * as React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
  CalendarToday24Regular,
} from "@fluentui/react-icons";

import type { CalendarView } from "../MealPlanCalendar/MealPlanCalendar.types";

import { Button } from "../../Button";
import { Text } from "../../Text";

const useStyles = makeStyles({
  viewControls: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    flexWrap: "wrap",
    justifyContent: "space-between",
    "@media (max-width: 768px)": {
      gap: tokens.spacingHorizontalXS,
      padding: tokens.spacingVerticalXS,
      justifyContent: "flex-start",
    },
  },
  viewButtons: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
    "@media (max-width: 768px)": {
      gap: tokens.spacingHorizontalXS,
    },
  },
  viewButton: {
    minWidth: "60px",
    "@media (max-width: 768px)": {
      minWidth: "50px",
      fontSize: tokens.fontSizeBase200,
      padding: "4px 8px",
    },
  },
  navigationButtons: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
    flexShrink: 0,
    "@media (max-width: 768px)": {
      marginLeft: "auto",
    },
  },
  dateDisplay: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    flex: 1,
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "@media (max-width: 768px)": {
      fontSize: tokens.fontSizeBase300,
      flex: "none",
      textAlign: "left",
      minWidth: 0,
      order: 3,
      width: "100%",
      marginTop: tokens.spacingVerticalXS,
    },
  },
});

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
    const styles = useStyles();

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
            icon={<ChevronLeft24Regular />}
            onClick={onPrevious}
            title="Previous"
          />
          <Button
            appearance="subtle"
            icon={<CalendarToday24Regular />}
            onClick={onToday}
          >
            Today
          </Button>
          <Button
            appearance="subtle"
            icon={<ChevronRight24Regular />}
            onClick={onNext}
            title="Next"
          />
        </div>
      </div>
    );
  }
);
