import type * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Children to render inside the card
   */
  children?: React.ReactNode;
  /**
   * Additional className to apply to the card
   */
  className?: string;
  /**
   * Click handler for the card
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
