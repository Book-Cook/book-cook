import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { EditorMenuBar } from "./EditorMenuBar";
import { getEditorExtensions } from "./utils";
import type { TiptapEditorProps } from "./TiptapEditorProps.types";

const useStyles = makeStyles({
  editorWrapper: {
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    overflow: "hidden",
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
      marginTop: "0",
      marginBottom: tokens.spacingVerticalS,
      lineHeight: tokens.lineHeightBase300,
    },
    "& h1, & h2, & h3": {
      color: tokens.colorNeutralForeground1,
      marginTop: tokens.spacingVerticalL,
      marginBottom: tokens.spacingVerticalS,
      lineHeight: tokens.lineHeightBase500,
      fontWeight: tokens.fontWeightSemibold,
    },
    "& h1": { fontSize: tokens.fontSizeHero800 },
    "& h2": { fontSize: tokens.fontSizeHero700 },
    "& h3": { fontSize: tokens.fontSizeBase600 },
    "& ul, & ol": {
      ...shorthands.padding("0", "0", "0", tokens.spacingHorizontalXXL),
      marginTop: "0",
      marginBottom: tokens.spacingVerticalS,
    },
    "& li > p:last-child": {
      marginBottom: tokens.spacingVerticalXS,
    },
    "& a": {
      color: tokens.colorBrandForegroundLink,
      textDecorationLine: "none",
      cursor: "pointer",
      "&:hover": {
        color: tokens.colorBrandForegroundLinkHover,
        textDecorationLine: "underline",
      },
    },
    "& strong": {
      fontWeight: tokens.fontWeightSemibold,
    },
    "& p.is-editor-empty:first-child::before": {
      content: "attr(data-placeholder)",
      float: "left",
      color: tokens.colorNeutralForeground4,
      pointerEvents: "none",
      height: "0",
      fontStyle: "normal",
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
  }, [value]);

  return (
    <div className={styles.editorWrapper}>
      {editor && <EditorMenuBar editor={editor} />}
      <div className={styles.editorContentArea}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
