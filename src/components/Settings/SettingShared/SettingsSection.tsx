import * as React from "react";
import { makeStyles } from "@griffel/react";
import {
  tokens,
  AccordionItem,
  AccordionPanel,
  AccordionHeader,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "24px 0px",
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  settingGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  accordionHeader: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
});

export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  itemValue: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  children,
  itemValue,
  title,
  icon,
}) => {
  const styles = useStyles();

  return (
    <AccordionItem value={itemValue}>
      <AccordionHeader
        size="large"
        icon={icon}
        className={styles.accordionHeader}
      >
        {title}
      </AccordionHeader>
      <AccordionPanel>
        {<section className={styles.section}>{children}</section>}
      </AccordionPanel>
    </AccordionItem>
  );
};
