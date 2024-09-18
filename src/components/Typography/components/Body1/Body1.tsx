import { createText } from "../../utils";
import { makeStyles } from "@griffel/react";
import type { FunctionComponent } from "react";
import type { TextProps } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    fontFamily: `"Roboto", sans-serif`,
  },
});

export const Body1: FunctionComponent<TextProps> = createText(
  { as: "p", font: "base", size: 400, weight: "regular" },
  useStyles,
  "Body1"
);
