import * as React from "react";
import {
  Toolbar as ToolbarComponent,
  Link as FluentLink,
  Button,
} from "@fluentui/react-components";
import { LargeTitle } from "../";
import { makeStyles } from "@griffel/react";
import { tokens } from "@fluentui/react-theme";
import { SearchBar } from "./SearchBar";
import { useRouter } from "next/router";

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
    backgroundColor: tokens.colorNeutralBackground1,
  },
  linkStyles: {
    textDecorationLine: "none",
    color: tokens.colorNeutralForeground1,
  },
});

export const Toolbar = () => {
  const toolbarStyles = useToolbarStyles();
  const router = useRouter();

  const onNewRecipeButtonPress = () => {
    router.push(`/newRecipe`);
  };

  const onHomePageButtonPress = () => {
    router.push(`/`);
  };

  return (
    <ToolbarComponent className={toolbarStyles.root}>
      <FluentLink
        style={{
          textDecorationLine: "none",
          color: tokens.colorNeutralForeground1,
        }}
        onClick={onHomePageButtonPress}
      >
        <LargeTitle size={700}>Book Cook</LargeTitle>
      </FluentLink>
      <div style={{ display: "flex", gap: "20px" }}>
        <Button appearance="subtle" onClick={onNewRecipeButtonPress}>
          New recipe
        </Button>

        <SearchBar />
      </div>
    </ToolbarComponent>
  );
};
