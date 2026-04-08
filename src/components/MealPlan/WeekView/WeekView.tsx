import * as React from "react";
import { clsx } from "clsx";

import { HOUR_HEIGHT, MIN_HOUR, TIME_COLUMN_WIDTH } from "./constants";
import { DayColumn } from "./DayColumn";
import styles from "./WeekView.module.css";
import type { WeekViewProps } from "./WeekView.types";
import {
  WeekHeader,
  TimeColumn,
  CurrentTimeLine,
} from "../components/WeekViewComponents";
import { formatDateString } from "../utils/formatDateString";
import { getCurrentTimePosition } from "../utils/getCurrentTimePosition";
import { getInitialScrollPosition } from "../utils/getInitialScrollPosition";
import { getMealsForDate } from "../utils/getMealsForDate";
import { getWeekDates } from "../utils/getWeekDates";
import { isPastDate, isToday } from "../utils/monthCalendarUtils";

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      const scrollPosition = getInitialScrollPosition(MIN_HOUR, HOUR_HEIGHT);
      scrollRef.current.scrollTop = scrollPosition;
    }
  }, []);

  const weekDates = React.useMemo(
    () => getWeekDates(currentDate),
    [currentDate],
  );

  const currentTimePosition = React.useMemo(
    () => getCurrentTimePosition(currentTime, MIN_HOUR, HOUR_HEIGHT),
    [currentTime],
  );

  return (
    <div className={styles.container}>
      <WeekHeader weekDates={weekDates} />

      <div ref={scrollRef} className={styles.scrollContainer}>
        <div
          className={styles.gridContainer}
          style={{
            gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(7, 1fr)`,
          }}
        >
          <TimeColumn />

          {weekDates.map((date) => {
            const dateStr = formatDateString(date);
            const meals = getMealsForDate(date, mealPlans);
            const isPast = isPastDate(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={dateStr}
                className={clsx(styles.dayColumn, isPast && styles.pastDay)}
                style={{ minHeight: `${HOUR_HEIGHT * 17}px` }}
              >
                <DayColumn
                  date={dateStr}
                  meals={meals}
                  onRemoveMeal={(time, index) =>
                    onMealRemove(dateStr, time, index)
                  }
                  isPast={isPast}
                />

                {isTodayDate && currentTimePosition !== null && (
                  <CurrentTimeLine position={currentTimePosition} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
