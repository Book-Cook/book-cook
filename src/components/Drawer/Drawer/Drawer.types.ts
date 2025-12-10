import type * as React from "react";

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
    open: boolean;
    onOpenChange?: DrawerOnOpenChange;
    position?: DrawerPosition;
    size?: DrawerSize;
    closeOnEscape?: boolean;
    closeOnBackdropClick?: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
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
