import * as React from "react";
import { BodyText, PageTitle, SectionHeading, Text } from "../Typography";
import Markdown from "react-markdown";
import { ListItemProps, MarkdownParserProps } from "./MarkdownParser.types";

export const MarkdownParser: React.FC<MarkdownParserProps> = (props) => {
  const { markdownInput } = props;

  return (
    <Markdown
      components={{
        p: ({ children }) => <BodyText as="p">{children}</BodyText>,
        title: ({ children }) => <PageTitle as="h1">{children}</PageTitle>,
        h1: ({ children }) => <SectionHeading as="h1">{children}</SectionHeading>,
        strong: ({ children }) => (
          <Text variant="bodyText" as="strong" bold>
            {children}
          </Text>
        ),
        li: ({ children, ...props }: ListItemProps) => (
          <li
            style={{
              display: "list-item",
              listStyleType: props.listStyleType || "inherit",
            }}
          >
            <BodyText as="p" style={{ display: "block" }}>
              {children}
            </BodyText>
          </li>
        ),
      }}
    >
      {markdownInput}
    </Markdown>
  );
};
