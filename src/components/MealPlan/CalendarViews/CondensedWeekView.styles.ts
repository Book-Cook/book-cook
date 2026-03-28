import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useCondensedWeekViewStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    height: "100%",
    overflow: "hidden",
  },
  weekHeader: {
    display: "contents", // This makes the header items flow into the main grid
  },
  dayColumn: {
    display: "flex",
    flexDirection: "column",
    minHeight: "400px",
  },
  dayHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalXS,
    textAlign: "center",
    padding: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  dayName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1,
  },
  dayDate: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: 1,
  },
  isToday: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightBold,
  },
  mealsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    flex: 1,
  },
  emptyDay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
    textAlign: "center",
    padding: tokens.spacingVerticalXL,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  addMealSlot: {
    minHeight: "60px",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: tokens.spacingVerticalM,
    "&:hover": {
      ...shorthands.borderColor(tokens.colorBrandStroke1),
      backgroundColor: tokens.colorBrandBackground2,
      color: tokens.colorBrandForeground1,
    },
  },
  pastDay: {
    opacity: 0.5,
  },
  pastDayHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
});