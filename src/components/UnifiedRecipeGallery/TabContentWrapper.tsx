import * as React from "react";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  wrapper: {
    height: "100%",
    overflow: "auto",
  },
});

interface TabContentWrapperProps {
  children: React.ReactNode;
}

export const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ children }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
};