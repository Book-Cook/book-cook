import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";

export type ScaleOnHoverProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Scale factor on hover */
  scale?: number;
};

const useStyles = makeStyles({
  root: {
    transition: "transform 0.2s",
    "&:hover": {
      transform: "var(--scale-hover)",
    },
  },
});

export const ScaleOnHover: React.FC<ScaleOnHoverProps> = ({
  scale = 1.02,
  className,
  children,
  ...rest
}) => {
  const styles = useStyles();
  return (
    <div
      className={mergeClasses(styles.root, className)}
      style={{ "--scale-hover": `scale(${scale})` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
};
