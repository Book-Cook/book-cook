export type ListItemProps = {
  children?: React.ReactNode;
  listStyleType?: React.CSSProperties["listStyleType"];
};

export type MarkdownParserProps = {
  /**
   * The input for the markdown parser to render.
   */
  markdownInput: string;
};
