import * as React from "react";
import {
  Toolbar as ToolbarComponent,
  SearchBox,
  Link,
} from "@fluentui/react-components";
import { makeStyles } from "@griffel/react";
import { tokens } from "@fluentui/react-theme";

const useToolbarStyles = makeStyles({
  root: {
    position: "sticky",
    top: "0px",
    height: "48px",
    width: "100%",
    display: "flex",
    paddingLeft: "32px",
    paddingRight: "32px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    flexShrink: 0,
    zIndex: 10000,
    boxShadow: tokens.shadow2,
    backgroundColor: tokens.colorNeutralBackground5,
  },
  linkStyles: {
    textDecorationLine: "none",
    color: tokens.colorNeutralForeground1,
  },
});

export const Toolbar = () => {
  const toolbarStyles = useToolbarStyles();

  return (
    <ToolbarComponent className={toolbarStyles.root}>
      Book Cook
      <SearchBox appearance="outline" placeholder="Search for snacks" />
    </ToolbarComponent>
  );
};