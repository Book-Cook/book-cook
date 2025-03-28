import * as React from "react";
import {
  Tooltip,
  ToggleButton,
  ToggleButtonProps,
} from "@fluentui/react-components";

interface ToolbarButtonProps
  extends Pick<ToggleButtonProps, "icon" | "disabled"> {
  tooltip: string;
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  tooltip,
  icon,
  onClick,
  isActive = false,
  disabled = false,
}) => {
  return (
    <Tooltip content={tooltip} relationship="label">
      <ToggleButton
        as="button"
        appearance="subtle"
        size="small"
        icon={icon}
        checked={isActive}
        onClick={onClick}
        disabled={disabled}
      />
    </Tooltip>
  );
};
