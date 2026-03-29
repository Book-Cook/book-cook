/**
 * Drop zone component for week day
 */
import * as React from "react";
import { mergeClasses, tokens } from "@fluentui/react-components";
import { useDroppable } from "@dnd-kit/core";

import { Text } from "../../Text";

export type WeekDayDropZoneProps = {
  dateStr: string;
  className: string;
};

export const WeekDayDropZone: React.FC<WeekDayDropZoneProps> = ({ dateStr, className }) => {
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
      className={mergeClasses(className, isOver && 'dropping')}
      style={{
        borderColor: isOver ? tokens.colorBrandStroke1 : undefined,
        backgroundColor: isOver ? tokens.colorBrandBackground2 : undefined,
      }}
    >
      <Text>Drop recipe here</Text>
    </div>
  );
};