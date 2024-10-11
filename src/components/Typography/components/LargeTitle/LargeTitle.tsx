import { createText } from "../../utils";
import { makeStyles } from "@griffel/react";
import type { FunctionComponent } from "react";
import type { TextProps } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    fontFamily: `"Playfair Display"`,
  },
});

export const LargeTitle: FunctionComponent<TextProps> = createText(
  { as: "h2", font: "base", size: 900, weight: "semibold" },
  useStyles,
  "LargeTitle"
);
