import { makeStyles } from "@griffel/react";

export const useStyles = makeStyles({
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  controlsRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "16px",
    width: "100%",
    alignItems: "center",
    "@media (max-width: 500px)": {
      gridTemplateColumns: "1fr",
    },
  },
  searchWrapper: {
    flexGrow: 1,
    maxWidth: "500px",
  },
  sortDropdown: {
    minWidth: "220px",
  },
  tagPickerWrapper: {
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
    width: "100%",
  },
  cardWrapper: {
    display: "flex",
    justifyContent: "stretch",
    height: "100%",
  },
  fadeIn: {
    animationName: {
      from: { opacity: 0, transform: "translateY(8px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    animationDuration: ".3s",
    animationTimingFunction: "ease-out",
    animationFillMode: "both",
    animationDelay: "var(--fadeInDelay)",
    width: "100%",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "64px 32px",
    minHeight: "300px",
  },
});
