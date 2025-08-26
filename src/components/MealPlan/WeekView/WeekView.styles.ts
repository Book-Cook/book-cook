import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

import { HOUR_HEIGHT, TIME_COLUMN_WIDTH } from "./constants";

export const useWeekViewStyles = makeStyles({
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
    "@media (max-width: 768px)": {
      fontSize: tokens.fontSizeBase100,
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
  
  hourLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
    pointerEvents: "none",
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