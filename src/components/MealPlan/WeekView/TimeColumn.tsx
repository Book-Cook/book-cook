import * as React from "react";
import { Text, makeStyles, tokens, shorthands } from "@fluentui/react-components";

import { HOURS, formatHour, HOUR_HEIGHT, MIN_HOUR } from "./constants";

const useStyles = makeStyles({
  timeColumn: {
    ...shorthands.borderRight("1px", "solid", tokens.colorNeutralStroke1),
    position: "sticky",
    left: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1,
  },
  
  timeSlot: {
    height: `${HOUR_HEIGHT}px`,
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
});

export const TimeColumn: React.FC = React.memo(() => {
  const styles = useStyles();
  
  return (
    <div className={styles.timeColumn} data-testid="time-column">
      {HOURS.map(hour => (
        <div 
          key={hour} 
          className={styles.timeSlot}
          style={{ top: `${(hour - MIN_HOUR) * HOUR_HEIGHT}px` }}
          data-testid="time-slot"
        >
          <Text className={styles.timeLabel} data-testid="time-label">{formatHour(hour)}</Text>
        </div>
      ))}
    </div>
  );
});

TimeColumn.displayName = 'TimeColumn';