import * as React from "react";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { StarFilled, StarRegular } from "@fluentui/react-icons";

export type StarRatingProps = {
  rating: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
};

const useStyles = makeStyles({
  root: {
    display: "inline-flex",
    alignItems: "center",
    ...shorthands.gap("2px"),
    color: tokens.colorPaletteYellowForeground2,
  },
  star: {
    cursor: "pointer",
  },
});

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  readOnly,
  size = 16,
}) => {
  const styles = useStyles();
  const handleClick = (value: number) => {
    if (!readOnly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={styles.root} onClick={(e) => e.stopPropagation()}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const value = idx + 1;
        const Filled = value <= rating ? StarFilled : StarRegular;
        return (
          <Filled
            key={value}
            fontSize={size}
            className={styles.star}
            onClick={() => handleClick(value)}
          />
        );
      })}
    </div>
  );
};
