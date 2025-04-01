import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { EditorMenuBar } from "./EditorMenuBar";
import { getEditorExtensions } from "./utils";
import type { TiptapEditorProps } from "./TiptapEditorProps.types";

const useStyles = makeStyles({
  editorWrapper: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    overflow: "hidden",
    fontSize: "17px",
    lineHeight: "1.8",
  },
  editorContentArea: {
    minHeight: "200px",
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    outline: "none",
  },
  proseMirrorContent: {
    height: "100%",
    minHeight: "inherit",
    outline: "none",
    "& p": {
      marginTop: "18px",
      marginBottom: "18px",
      lineHeight: "1.8",
    },
    "& h1, & h2, & h3": {
      color: tokens.colorNeutralForeground1,
      marginTop: "32px",
      marginBottom: "16px",
      lineHeight: tokens.lineHeightBase500,
      fontWeight: tokens.fontWeightSemibold,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
      paddingBottom: "10px",
      fontSize: "1.5rem",
    },
    "& h1": {
      fontSize: tokens.fontSizeHero800,
      fontFamily: "'Georgia', serif",
    },
    "& h2": {
      fontSize: tokens.fontSizeHero700,
      fontFamily: "'Georgia', serif",
    },
    "& h3": {
      fontSize: tokens.fontSizeBase600,
      fontFamily: "'Georgia', serif",
    },
    "& ul, & ol": {
      ...shorthands.padding("0", "0", "0", "25px"),
      marginTop: "18px",
      marginBottom: "18px",
    },
    "& li": {
      marginBottom: "12px",
      position: "relative",
    },
    "& li > p:last-child": {
      marginBottom: tokens.spacingVerticalXS,
    },
    "& a": {
      color: tokens.colorBrandForegroundLink,
      textDecorationLine: "none",
      cursor: "pointer",
      borderBottom: `1px solid ${tokens.colorBrandStroke2Hover}`,
      transition: "border-bottom 0.2s ease",
      "&:hover": {
        color: tokens.colorBrandForegroundLinkHover,
        textDecorationLine: "underline",
        borderBottomWidth: "2px",
      },
    },
    "& strong": {
      fontWeight: tokens.fontWeightSemibold,
      fontFamily: "'Georgia', serif",
    },
    "& p.is-editor-empty:first-child::before": {
      content: "attr(data-placeholder)",
      float: "left",
      color: tokens.colorNeutralForeground4,
      pointerEvents: "none",
      height: "0",
      fontStyle: "normal",
    },
    "& img": {
      maxWidth: "100%",
      ...shorthands.borderRadius("8px"),
      marginTop: "16px",
      marginBottom: "16px",
    },
    "& blockquote": {
      borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
      paddingLeft: "16px",
      margin: "20px 0",
      color: tokens.colorNeutralForeground2,
      fontStyle: "italic",
    },
  },
});

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter recipe details...",
  readOnly = false,
}) => {
  const styles = useStyles();

  const editor = useEditor({
    extensions: getEditorExtensions(placeholder),
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.proseMirrorContent,
      },
    },
  });

  React.useEffect(() => {
    if (editor && editor.isEditable !== !readOnly) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  React.useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentContent = editor.getHTML();
      if (value !== currentContent) {
        editor.commands.setContent(value, false);
      }
    }
  }, [editor, value]);

  return (
    <div className={styles.editorWrapper}>
      {editor && <EditorMenuBar editor={editor} />}
      <div className={styles.editorContentArea}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
