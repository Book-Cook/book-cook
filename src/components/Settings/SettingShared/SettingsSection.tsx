import * as React from "react";
import {
  tokens,
  AccordionItem,
  AccordionPanel,
  AccordionHeader,
  Divider,
} from "@fluentui/react-components";
import { makeStyles } from "@griffel/react";

const useStyles = makeStyles({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "8px 0px 24px 0px",
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
  settingItem: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
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

  // Process children to add dividers between them
  const childrenWithDividers = React.Children.toArray(children)
    .filter(Boolean)
    .flatMap((child, index, array) => {
      if (index === array.length - 1) {
        return [child];
      }
      return [child, <Divider key={`divider-${index}`} />];
    });

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
        <section className={styles.section}>{childrenWithDividers}</section>
      </AccordionPanel>
    </AccordionItem>
  );
};
