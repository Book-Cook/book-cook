import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";

export type ScaleOnHoverProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Scale factor on hover */
  scale?: number;
};

const useStyles = makeStyles({
  root: {
    transition: "transform 0.2s",
  },
});

export const ScaleOnHover: React.FC<ScaleOnHoverProps> = ({
  scale = 1.02,
  className,
  children,
  ...rest
}) => {
  const styles = useStyles();
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className={mergeClasses(styles.root, className)}
      style={{ transform: hovered ? `scale(${scale})` : undefined }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {children}
    </div>
  );
};
