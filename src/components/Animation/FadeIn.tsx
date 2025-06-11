import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    opacity: 0,
    animationFillMode: "forwards",
    animationTimingFunction: "ease",
  },
  fadeIn: {
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    animationDuration: "0.5s",
  },
  fadeInUp: {
    animationName: {
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    animationDuration: "0.5s",
  },
});

export type FadeInProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  /** Whether to translate from bottom on start */
  up?: boolean;
};

export const FadeIn: React.FC<FadeInProps> = ({ delay = 0, up = false, className, children, ...rest }) => {
  const styles = useStyles();
  return (
    <div
      className={mergeClasses(styles.root, up ? styles.fadeInUp : styles.fadeIn, className)}
      style={{ animationDelay: `${delay}s` }}
      {...rest}
    >
      {children}
    </div>
  );
};
