import * as React from "react";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

const useStyles = makeStyles({
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
});

interface CurrentTimeLineProps {
  position: number;
}

export const CurrentTimeLine: React.FC<CurrentTimeLineProps> = React.memo(({ position }) => {
  const styles = useStyles();
  
  return (
    <div
      className={styles.currentTimeLine}
      style={{ top: `${position}px` }}
      data-testid="current-time-line"
    />
  );
});

CurrentTimeLine.displayName = 'CurrentTimeLine';