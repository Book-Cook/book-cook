import * as React from "react";
import { Text, makeStyles, tokens, shorthands } from "@fluentui/react-components";

import { DayColumn } from "./DayColumn";
import { 
  HOURS, 
  DAY_NAMES, 
  formatHour, 
  getTimePosition,
  HOUR_HEIGHT,
  TIME_COLUMN_WIDTH,
} from "./constants";
import type { MealPlanWithRecipes } from "../../../clientToServer/types";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.overflow("hidden"),
  },
  
  header: {
    display: "grid",
    gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(7, 1fr)`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1),
    minHeight: "40px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: `60px repeat(7, 1fr)`,
    },
  },
  
  headerTimeColumn: {
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
  },
  
  headerDay: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.padding(tokens.spacingVerticalS),
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
    "&:last-child": {
      borderRightWidth: 0,
    },
  },
  
  dayLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  
  dayNumber: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  
  todayHeader: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  
  todayLabel: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightBold,
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
  
  timeColumn: {
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
    position: "sticky",
    left: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1,
  },
  
  timeSlot: {
    height: `${HOUR_HEIGHT}px`,
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  
  timeLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
    transform: "translateY(-50%)",
  },
  
  dayColumn: {
    position: "relative",
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke2),
    minHeight: `${HOUR_HEIGHT * 17}px`,
    "&:last-child": {
      borderRightWidth: 0,
    },
  },
  
  currentTimeLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: tokens.colorPaletteRedBorder2,
    zIndex: 3,
    pointerEvents: "none",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "-6px",
      top: "-4px",
      width: "10px",
      height: "10px",
      ...shorthands.borderRadius(tokens.borderRadiusCircular),
      backgroundColor: tokens.colorPaletteRedBorder2,
    },
  },
  
  pastDay: {
    backgroundColor: tokens.colorNeutralBackground2,
    opacity: 0.7,
  },
});

interface WeekViewProps {
  currentDate: Date;
  mealPlans: MealPlanWithRecipes[];
  onMealRemove: (date: string, time: string, mealIndex: number) => Promise<void>;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  mealPlans,
  onMealRemove,
}) => {
  const styles = useStyles();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  // Update current time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Scroll to current time on mount
  React.useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const scrollPosition = ((minutes - 360) / 60) * HOUR_HEIGHT; // 6 AM = 360 minutes
      scrollRef.current.scrollTop = Math.max(0, scrollPosition - 100);
    }
  }, []);
  
  // Get week dates
  const getWeekDates = React.useCallback(() => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);
  
  const weekDates = React.useMemo(() => getWeekDates(), [getWeekDates]);
  const today = new Date().toDateString();
  
  // Get meals for a specific date
  const getMealsForDate = React.useCallback((date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const plan = mealPlans.find(p => p.date === dateStr);
    
    if (!plan) return [];
    
    const timeSlots = plan.meals.timeSlots || [];
    
    // Convert legacy meals to time slots
    const legacyTimeMap = {
      breakfast: '08:00',
      lunch: '12:30',
      dinner: '18:30',
      snack: '15:00',
    };
    
    const convertedSlots = [...timeSlots];
    
    Object.entries(legacyTimeMap).forEach(([mealType, time]) => {
      const meal = plan.meals[mealType as keyof typeof plan.meals];
      if (meal && typeof meal === 'object' && 'recipeId' in meal) {
        const existingSlot = convertedSlots.find(slot => slot.time === time);
        if (existingSlot) {
          existingSlot.meals.push(meal as any);
        } else {
          convertedSlots.push({
            time,
            meals: [meal as any],
          });
        }
      }
    });
    
    return convertedSlots.sort((a, b) => a.time.localeCompare(b.time));
  }, [mealPlans]);
  
  // Calculate current time line position
  const currentTimePosition = React.useMemo(() => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours < 6 || hours > 22) return null;
    
    return getTimePosition(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }, [currentTime]);
  
  return (
    <div className={styles.container}>
      {/* Simple header with day labels */}
      <div className={styles.header}>
        <div className={styles.headerTimeColumn} />
        {weekDates.map((date, index) => {
          const isToday = date.toDateString() === today;
          return (
            <div
              key={date.toISOString()}
              className={`${styles.headerDay} ${isToday ? styles.todayHeader : ''}`}
            >
              <Text className={`${styles.dayLabel} ${isToday ? styles.todayLabel : ''}`}>
                {DAY_NAMES[index]}
              </Text>
              <Text className={`${styles.dayNumber} ${isToday ? styles.todayLabel : ''}`}>
                {date.getDate()}
              </Text>
            </div>
          );
        })}
      </div>
      
      {/* Scrollable content */}
      <div ref={scrollRef} className={styles.scrollContainer}>
        <div className={styles.gridContainer}>
          {/* Time column */}
          <div className={styles.timeColumn}>
            {HOURS.map(hour => (
              <div key={hour} className={styles.timeSlot}>
                <Text className={styles.timeLabel}>{formatHour(hour)}</Text>
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {weekDates.map(date => {
            const dateStr = date.toISOString().split("T")[0];
            const meals = getMealsForDate(date);
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
            
            return (
              <div
                key={dateStr}
                className={`${styles.dayColumn} ${isPast ? styles.pastDay : ''}`}
              >
                <DayColumn
                  date={dateStr}
                  meals={meals}
                  onRemoveMeal={(time, index) => onMealRemove(dateStr, time, index)}
                  isPast={isPast}
                />
                
                {/* Current time indicator */}
                {date.toDateString() === today && currentTimePosition !== null && (
                  <div
                    className={styles.currentTimeLine}
                    style={{ top: `${currentTimePosition}px` }}
                  />
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