import * as React from "react";
import {
  renderText_unstable,
  useText_unstable,
  useTextStyles_unstable,
} from "@fluentui/react-components";
import type { TextProps } from "@fluentui/react-components";
import { mergeClasses } from "@griffel/react";
import type { ForwardRefComponent } from "@fluentui/react-utilities";

export function createText(
  defaultProps: TextProps,
  useStyles: () => Record<any, string>,
  displayName: string
): React.FunctionComponent<TextProps> {
  const TextComponent: ForwardRefComponent<TextProps> = React.forwardRef(
    (props, ref) => {
      const mergedProps = { ...defaultProps, ...props };
      const styles = useStyles();
      const state = useText_unstable(mergedProps as TextProps, ref);

      useTextStyles_unstable(state);

      state.root.className = mergeClasses(
        state.root.className,
        styles.root,
        mergedProps.className
      );

      return renderText_unstable(state);
    }
  );
  TextComponent.displayName = displayName;

  return TextComponent;
}
