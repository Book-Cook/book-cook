export type MultiSelectMenuProps = {
  /** Available options to show as checkboxes */
  options: string[];
  /** Currently selected values */
  value: string[];
  /** Called with the full new selection when any option is toggled */
  onChange: (value: string[]) => void;
  /** Label shown on the trigger button. Count appended when items are selected, e.g. "Tags (3)" */
  label: string;
  /** Shown inside the menu when options is empty */
  emptyMessage?: string;
  /** Optional class name applied to the wrapper div */
  className?: string;
};
