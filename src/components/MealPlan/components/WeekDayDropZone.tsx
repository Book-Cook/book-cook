/**
 * Drop zone component for week day
 */
import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { clsx } from "clsx";

import { Text } from "../../Text";

export type WeekDayDropZoneProps = {
  dateStr: string;
  className: string;
};

export const WeekDayDropZone: React.FC<WeekDayDropZoneProps> = ({
  dateStr,
  className,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `week-day-${dateStr}`,
    data: {
      date: dateStr,
      type: "week-day",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(className, isOver && "dropping")}
      style={{
        borderColor: isOver ? "var(--brand-Primary)" : undefined,
        backgroundColor: isOver
          ? "color-mix(in srgb, var(--brand-Primary) 10%, transparent)"
          : undefined,
      }}
    >
      <Text>Drop recipe here</Text>
    </div>
  );
};
