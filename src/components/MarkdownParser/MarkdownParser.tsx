import * as React from "react";
import { Body1, Display, LargeTitle } from "../Typography";
import Markdown from "react-markdown";
import { ListItemProps, MarkdownParserProps } from "./MarkdownParser.types";

export const MarkdownParser: React.FC<MarkdownParserProps> = (props) => {
  const { markdownInput } = props;

  return (
    <Markdown
      components={{
        p: ({ children }) => <Body1 as="p">{children}</Body1>,
        title: ({ children }) => <Display as="h1">{children}</Display>,
        h1: ({ children }) => (
          <LargeTitle as="h1" style={{ display: "block" }}>
            {children}
          </LargeTitle>
        ),
        strong: ({ children }) => (
          <Body1 as="strong" weight="bold">
            {children}
          </Body1>
        ),
        li: ({ children, ...props }: ListItemProps) => (
          <li
            style={{
              display: "list-item",
              listStyleType: props.listStyleType || "inherit",
            }}
          >
            <Body1 as="p" style={{ display: "block" }}>
              {children}
            </Body1>
          </li>
        ),
      }}
    >
      {markdownInput}
    </Markdown>
  );
};
