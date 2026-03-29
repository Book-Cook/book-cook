import type { ReactNode } from "react";
import type {
  AccordionMultipleProps,
  AccordionSingleProps,
} from "@radix-ui/react-accordion";

export type AccordionItem = {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type AccordionType = "single" | "multiple";
export type AccordionValue = string | string[];

type AccordionRootProps =
  | Omit<AccordionSingleProps, "type" | "collapsible" | "children">
  | Omit<AccordionMultipleProps, "type" | "children">;

export type AccordionProps = AccordionRootProps & {
  items: AccordionItem[];
  type?: AccordionType;
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  onValueChange?: (value: AccordionValue) => void;
  collapsible?: boolean;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
};
