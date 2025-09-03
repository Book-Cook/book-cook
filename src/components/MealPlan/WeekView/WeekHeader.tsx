import * as React from "react";
import { Text, makeStyles, tokens, shorthands, mergeClasses } from "@fluentui/react-components";

import { DAY_NAMES, TIME_COLUMN_WIDTH } from "./constants";
import { isToday } from "../utils/dateUtils";

const useStyles = makeStyles({
  header: {
    display: "grid",
    gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(7, 1fr)`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1),
    height: "24px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: `60px repeat(7, 1fr)`,
    },
  },
  
  headerTimeColumn: {
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
  },
  
  headerDay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.padding(`2px ${tokens.spacingHorizontalXS}`),
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
    height: "24px",
    "&:last-child": {
      borderRightWidth: 0,
    },
  },
  
  dayText: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  
  todayHeader: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  
  todayText: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightBold,
  },
});

interface WeekHeaderProps {
  weekDates: Date[];
}

export const WeekHeader: React.FC<WeekHeaderProps> = React.memo(({ weekDates }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.header} data-testid="week-header">
      <div className={styles.headerTimeColumn} data-testid="header-time-column" />
      {weekDates.map((date, index) => {
        const isTodayDate = isToday(date);
        return (
          <div
            key={date.toISOString()}
            className={mergeClasses(styles.headerDay, isTodayDate && styles.todayHeader)}
            data-testid={isTodayDate ? "today-header" : "day-header"}
          >
            <Text className={mergeClasses(styles.dayText, isTodayDate && styles.todayText)}>
              {DAY_NAMES[index]} {date.getDate()}
            </Text>
          </div>
        );
      })}
    </div>
  );
});

WeekHeader.displayName = 'WeekHeader';