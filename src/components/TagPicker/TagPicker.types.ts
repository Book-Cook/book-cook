/**
 * Props for the TagFilter component which allows users to select and filter content by tags.
 */
export type TagFilterProps = {
  /**
   * Array of existing tags to display as options in the combobox dropdown.
   * These tags will be presented as selectable options in the dropdown menu.
   */
  availableTags: string[];

  /**
   * Currently selected tags that will be displayed as tag pills.
   * Users can remove tags from this selection by clicking the remove button on each pill.
   */
  selectedTags: string[];

  /**
   * Callback that fires when tags selection changes (add or remove).
   * @param tags The updated array of selected tags after the change
   */
  onTagsChange: (tags: string[]) => void;

  /**
   * Optional placeholder text for the tag input field.
   * @default "Filter by tags"
   */
  placeholder?: string;
};
