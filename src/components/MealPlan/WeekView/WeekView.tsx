import * as React from "react";
import { makeStyles, tokens, shorthands, mergeClasses } from "@fluentui/react-components";

import { HOUR_HEIGHT, TIME_COLUMN_WIDTH, MIN_HOUR } from "./constants";
import { DayColumn } from "./DayColumn";
import { WeekHeader, TimeColumn, CurrentTimeLine } from "../components/WeekViewComponents";
import { getWeekDates } from "../utils/getWeekDates";
import { isToday } from "../utils/isToday";
import { isPastDate } from "../utils/isPastDate";
import { formatDateString } from "../utils/formatDateString";
import { getCurrentTimePosition } from "../utils/getCurrentTimePosition";
import { getInitialScrollPosition } from "../utils/getInitialScrollPosition";
import { getMealsForDate } from "../utils/getMealsForDate";

import type { WeekViewProps } from "./WeekView.types";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.overflow("hidden"),
  },
  
  scrollContainer: {
    flex: 1,
    ...shorthands.overflow("auto"),
    position: "relative",
    WebkitOverflowScrolling: "touch",
  },
  
  gridContainer: {
    display: "grid",
    gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(7, 1fr)`,
    position: "relative",
    minWidth: "640px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: `60px repeat(7, 1fr)`,
      minWidth: "100%",
    },
  },
  
  dayColumn: {
    position: "relative",
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke2),
    minHeight: `${HOUR_HEIGHT * 17}px`,
    "&:last-child": {
      borderRightWidth: 0,
    },
  },
  
  pastDay: {
    backgroundColor: tokens.colorNeutralBackground2,
    opacity: 0.7,
  },
});

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const styles = useStyles();
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
  
  const weekDates = React.useMemo(() => getWeekDates(currentDate), [currentDate]);
  
  const currentTimePosition = React.useMemo(
    () => getCurrentTimePosition(currentTime, MIN_HOUR, HOUR_HEIGHT),
    [currentTime]
  );
  
  return (
    <div className={styles.container}>
      <WeekHeader weekDates={weekDates} />
      
      <div ref={scrollRef} className={styles.scrollContainer}>
        <div className={styles.gridContainer}>
          <TimeColumn />
          
          {weekDates.map(date => {
            const dateStr = formatDateString(date);
            const meals = getMealsForDate(date, mealPlans);
            const isPast = isPastDate(date);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={dateStr}
                className={mergeClasses(styles.dayColumn, isPast && styles.pastDay)}
              >
                <DayColumn
                  date={dateStr}
                  meals={meals}
                  onRemoveMeal={(time, index) => onMealRemove(dateStr, time, index)}
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