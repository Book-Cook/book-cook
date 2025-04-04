import * as React from "react";
import {
  Button,
  Tooltip,
  makeStyles,
  shorthands,
  tokens,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  MenuDivider,
} from "@fluentui/react-components";
import {
  DeleteRegular,
  Heart20Regular,
  MoreHorizontalRegular,
  EditRegular,
  TagRegular,
  EmojiRegular,
} from "@fluentui/react-icons";

export const useHeaderActionsStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  favoriteButton: {
    color: tokens.colorPaletteRedForeground1,
    ":hover": {
      color: tokens.colorPaletteRedForeground2,
    },
    ":hover:active": {
      color: tokens.colorPaletteRedForeground3,
    },
  },
});

export type RecipeHeaderActionsProps = {
  onAddToCollection: () => void;
  onDelete: () => void;
  onChangeTitle: () => void;
  onChangeEmoji: () => void;
  onAddTags: () => void;
};

export const RecipeHeaderActions: React.FC<RecipeHeaderActionsProps> = ({
  onAddToCollection,
  onDelete,
  onChangeTitle,
  onChangeEmoji,
  onAddTags,
}) => {
  const styles = useHeaderActionsStyles();

  return (
    <div className={styles.root}>
      <Tooltip content="Add to Collection" relationship="label">
        <Button
          aria-label="Add to Collection"
          appearance="transparent"
          icon={<Heart20Regular />}
          shape="circular"
          onClick={onAddToCollection}
          className={styles.favoriteButton}
        />
      </Tooltip>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Tooltip content="More options" relationship="label">
            <Button
              aria-label="More options"
              appearance="subtle"
              icon={<MoreHorizontalRegular />}
              shape="circular"
            />
          </Tooltip>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem icon={<EditRegular />} onClick={onChangeTitle}>
              Change Title
            </MenuItem>
            <MenuItem icon={<EmojiRegular />} onClick={onChangeEmoji}>
              Change Emoji
            </MenuItem>
            <MenuItem icon={<TagRegular />} onClick={onAddTags}>
              Add Tags
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<DeleteRegular />} onClick={onDelete}>
              Delete recipe
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
