import * as React from "react";
import { Editor } from "@tiptap/react";
import {
  Divider,
  Toolbar,
  ToggleButton,
  Tooltip,
  makeStyles,
  tokens,
  shorthands,
} from "@fluentui/react-components";
import {
  TextBold24Regular,
  TextItalic24Regular,
  TextUnderline24Regular,
  TextHeader124Regular,
  TextHeader224Regular,
  TextHeader324Regular,
  TextBulletListLtr24Regular,
  TextNumberListLtr24Regular,
  Link24Regular,
} from "@fluentui/react-icons";
import { ToolbarButton } from "./EditorToolbarButton";

const useStyles = makeStyles({
  menuBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    ...shorthands.padding(tokens.spacingHorizontalS, tokens.spacingVerticalXS),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.gap(tokens.spacingHorizontalXS),
  },
  divider: {
    flexGrow: "0",
    marginLeft: tokens.spacingHorizontalXXS,
    marginRight: tokens.spacingHorizontalXXS,
  },
});

const getToolbarItems = (editor: Editor, handleSetLink: () => void) => {
  const items = [
    {
      type: "button" as const,
      tooltip: "Bold",
      icon: TextBold24Regular,
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      can: editor.can().toggleBold(),
    },
    {
      type: "button" as const,
      tooltip: "Italic",
      icon: TextItalic24Regular,
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      can: editor.can().toggleItalic(),
    },
    {
      type: "button" as const,
      tooltip: "Underline",
      icon: TextUnderline24Regular,
      command: () => editor.chain().focus().toggleMark("underline").run(),
      isActive: editor.isActive("underline"),
      can: editor.can().toggleMark("underline"),
    },

    { type: "divider" as const },
    {
      type: "button" as const,
      tooltip: "Heading 1",
      icon: TextHeader124Regular,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      can: editor.can().toggleHeading({ level: 1 }),
    },
    {
      type: "button" as const,
      tooltip: "Heading 2",
      icon: TextHeader224Regular,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      can: editor.can().toggleHeading({ level: 2 }),
    },
    {
      type: "button" as const,
      tooltip: "Heading 3",
      icon: TextHeader324Regular,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      can: editor.can().toggleHeading({ level: 3 }),
    },

    { type: "divider" as const },
    {
      type: "button" as const,
      tooltip: "Bullet List",
      icon: TextBulletListLtr24Regular,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      can: editor.can().toggleBulletList(),
    },
    {
      type: "button" as const,
      tooltip: "Numbered List",
      icon: TextNumberListLtr24Regular,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      can: editor.can().toggleOrderedList(),
    },

    { type: "divider" as const },
    {
      type: "linkButton" as const,
      tooltip: editor.isActive("link") ? "Edit Link" : "Add Link",
      icon: Link24Regular,
      command: handleSetLink,
      isActive: editor.isActive("link"),
      can: editor.can().setLink({ href: "" }),
    },
  ];
  return items;
};

export type EditorMenuBarProps = {
  editor: Editor;
};

export const EditorMenuBar: React.FC<EditorMenuBarProps> = ({ editor }) => {
  const styles = useStyles();

  const handleSetLink = React.useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const toolbarItems = getToolbarItems(editor, handleSetLink);

  return (
    <Toolbar
      size="small"
      aria-label="Formatting options"
      className={styles.menuBar}
    >
      {toolbarItems.map((item, index) => {
        switch (item.type) {
          case "divider":
            return (
              <Divider
                key={`divider-${index}`}
                vertical
                className={styles.divider}
              />
            );
          case "button":
            const IconComponent = item.icon as React.ComponentType;
            return (
              <ToolbarButton
                key={item.tooltip}
                tooltip={item.tooltip}
                icon={<IconComponent />}
                onClick={item.command}
                isActive={item.isActive}
                disabled={!item.can}
              />
            );
          case "linkButton":
            const LinkIconComponent = item.icon as React.ComponentType;
            return (
              <Tooltip
                key={item.tooltip}
                content={item.tooltip}
                relationship="label"
              >
                <ToggleButton
                  as="button"
                  appearance="subtle"
                  size="small"
                  icon={<LinkIconComponent />}
                  checked={item.isActive}
                  onClick={item.command}
                  disabled={!item.can}
                />
              </Tooltip>
            );
          default:
            return null; // Should not happen with defined types
        }
      })}
    </Toolbar>
  );
};
