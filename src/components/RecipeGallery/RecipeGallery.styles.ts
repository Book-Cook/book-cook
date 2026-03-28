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
    flexDirection: "column",
    gap: "24px",
  },
  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  controlsRow: {
    // backgroundColor: "pink",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    width: "100%",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "stretch",
    },
  },
  searchWrapper: {
    width: "300px",
    flexShrink: 0,
  },
  tagPickerWrapper: {
    width: "300px",
    flexShrink: 0,
  },
  sortDropdown: {
    marginLeft: "auto",
    marginRight: "0",
    width: "180px",
    flexShrink: 0,
    height: "36px",
    "& button": {
      height: "36px",
    },
    borderRadius: "8px",
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
