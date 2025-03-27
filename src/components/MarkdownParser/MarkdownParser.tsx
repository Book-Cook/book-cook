import * as React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Text,
  Link,
  tokens,
  makeStyles,
  mergeClasses,
} from "@fluentui/react-components";
import type { MarkdownParserProps } from "./MarkdownParser.types";

const FONT_HEADING = `"Playfair Display", serif`;
const FONT_BODY = `"Roboto", sans-serif`;
const FONT_MONO = `Consolas, 'Courier New', Courier, monospace`;

const useStyles = makeStyles({
  headingFont: { fontFamily: FONT_HEADING },
  bodyFont: { fontFamily: FONT_BODY },
  monospaceFont: { fontFamily: FONT_MONO },

  paragraph: {
    display: "block",
    marginBottom: tokens.spacingVerticalM,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
    fontWeight: tokens.fontWeightRegular,
  },
  heading1: {
    marginBottom: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalL,
  },
  heading2: {
    marginBottom: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalL,
  },
  heading3: {
    marginBottom: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalL,
  },
  list: {
    marginBottom: tokens.spacingVerticalM,
    paddingLeft: "40px",
  },
  listItem: {
    marginBottom: tokens.spacingVerticalSNudge,
  },
  hr: {
    border: "none",
    borderTopWidth: tokens.strokeWidthThin,
    borderTopStyle: "solid",
    borderTopColor: tokens.colorNeutralStroke2,
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalL,
  },
  strong: {
    fontWeight: tokens.fontWeightSemibold || 600,
    fontStyle: "normal",
  },
  emphasis: {
    fontStyle: "italic",
  },
});

export const MarkdownParser: React.FC<MarkdownParserProps> = ({
  markdownInput,
}) => {
  const styles = useStyles();

  const components = {
    p: (props: React.PropsWithChildren<{}>) => (
      <p
        className={mergeClasses(styles.bodyFont, styles.paragraph)}
        {...props}
      />
    ),
    h1: (props: React.PropsWithChildren<{}>) => (
      <Text
        as="h1"
        size={900}
        weight="bold"
        block
        className={mergeClasses(styles.headingFont, styles.heading1)}
        {...props}
      />
    ),
    h2: (props: React.PropsWithChildren<{}>) => (
      <Text
        as="h2"
        size={800}
        weight="semibold"
        block
        className={mergeClasses(styles.headingFont, styles.heading2)}
        {...props}
      />
    ),
    h3: (props: React.PropsWithChildren<{}>) => (
      <Text
        as="h3"
        size={700}
        weight="semibold"
        block
        className={mergeClasses(styles.headingFont, styles.heading3)}
        {...props}
      />
    ),
    strong: (props: React.PropsWithChildren<{}>) => (
      <strong
        className={mergeClasses(styles.bodyFont, styles.strong)}
        {...props}
      />
    ),
    em: (props: React.PropsWithChildren<{}>) => (
      <em
        className={mergeClasses(styles.bodyFont, styles.emphasis)}
        {...props}
      />
    ),
    ul: (props: React.PropsWithChildren<{}>) => (
      <ul className={styles.list} {...props} />
    ),
    ol: (props: React.PropsWithChildren<{}>) => (
      <ol className={styles.list} {...props} />
    ),
    li: (props: React.PropsWithChildren<{}>) => (
      <li className={mergeClasses(styles.bodyFont, styles.listItem)}>
        {props.children}
      </li>
    ),
    a: ({ node, ...props }: any) => (
      <Link className={styles.bodyFont} {...props} />
    ),
    hr: (props: React.PropsWithChildren<{}>) => (
      <hr className={styles.hr} {...props} />
    ),
  };

  return (
    <Markdown components={components} remarkPlugins={[remarkGfm]}>
      {markdownInput}
    </Markdown>
  );
};
