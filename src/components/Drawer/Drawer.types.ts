import * as React from "react";

export type DrawerPosition = "start" | "end" | "top" | "bottom";
export type DrawerSize = "small" | "medium" | "large";

export type DrawerOpenChangeData = { open: boolean };
export type DrawerOpenChangeEvent = Event | React.SyntheticEvent;
export type DrawerOnOpenChange = (
  event: DrawerOpenChangeEvent,
  data: DrawerOpenChangeData
) => void;

export type DrawerProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> & {
    /**
     * Whether the drawer is visible.
     */
    open: boolean;
    /**
     * Callback fired when the open state should change.
     */
    onOpenChange?: DrawerOnOpenChange;
    /**
     * Which edge of the viewport the drawer should attach to.
     */
    position?: DrawerPosition;
    /**
     * Width/height sizing preset.
     */
    size?: DrawerSize;
    /**
     * Close the drawer when the user presses Escape.
     */
    closeOnEscape?: boolean;
    /**
     * Close the drawer when the backdrop is clicked.
     */
    closeOnBackdropClick?: boolean;
    /**
     * Accessible name for the dialog when no labelled-by is provided.
     */
    ariaLabel?: string;
    /**
     * ID of the title element for aria-labelledby.
     */
    ariaLabelledBy?: string;
    /**
     * Extra props for the backdrop element.
     */
    backdropProps?: React.HTMLAttributes<HTMLDivElement>;
  }
>;

export type DrawerHeaderProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;

export type DrawerHeaderTitleProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> & {
    action?: React.ReactNode;
  }
>;

export type DrawerBodyProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;
