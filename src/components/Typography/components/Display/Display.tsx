import { createText } from "../../utils";
import { makeStyles } from "@griffel/react";
import type { FunctionComponent } from "react";
import type { TextProps } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    fontFamily: `"Playfair Display"`,
  },
});

export const Display: FunctionComponent<TextProps> = createText(
  { as: "h1", font: "base", size: 900, weight: "bold" },
  useStyles,
  "Display"
);
