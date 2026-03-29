import { useEffect, useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { clsx } from "clsx";

import styles from "./Tooltip.module.css";
import type { TooltipProps } from "./Tooltip.types";

/**
 * Tooltip component for concise contextual hints.
 */
export const Tooltip = ({
  content,
  children,
  side = "top",
  align = "center",
  delay = 200,
  offset = 8,
  disabled = false,
  withArrow = true,
  className,
}: TooltipProps) => {
  const shouldRenderContent = !disabled && content != null;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldRenderContent) {
      setOpen(false);
    }
  }, [shouldRenderContent]);

  return (
    <TooltipPrimitive.Provider delayDuration={delay}>
      <TooltipPrimitive.Root
        open={shouldRenderContent ? open : false}
        onOpenChange={(nextOpen) => {
          if (!shouldRenderContent) {
            return;
          }
          setOpen(nextOpen);
        }}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        {shouldRenderContent && (
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side={side}
              align={align}
              sideOffset={offset}
              className={clsx(styles.content, className)}
            >
              {content}
              {withArrow && <TooltipPrimitive.Arrow className={styles.arrow} />}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
