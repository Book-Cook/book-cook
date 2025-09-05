import * as React from "react";
import { makeStyles, tokens, shorthands, mergeClasses } from "@fluentui/react-components";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { HOURS, HOUR_HEIGHT, getTimePosition, MIN_HOUR } from "./constants";
import { MealCard } from "./MealCard";

import type { MealItem } from "../../../clientToServer/types";

const useStyles = makeStyles({
  column: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  
  dropZone: {
    position: "absolute",
    left: 0,
    right: 0,
    height: `${HOUR_HEIGHT}px`,
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  
  dropZoneActive: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.border("2px", "dashed", tokens.colorBrandStroke1),
  },
  
  hourSlot: {
    position: "absolute",
    left: 0,
    right: 0,
    height: `${HOUR_HEIGHT}px`,
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke2),
  },
});

interface DayColumnProps {
  date: string;
  meals: Array<{
    time: string;
    meals: Array<MealItem & { recipe?: Record<string, unknown> }>;
  }>;
  onRemoveMeal: (time: string, mealIndex: number) => void;
  isPast?: boolean;
}

interface DropZoneProps {
  date: string;
  hour: number;
  isActive: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ date, hour, isActive }) => {
  const styles = useStyles();
  const time = `${hour.toString().padStart(2, '0')}:00`;
  
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${date}-${time}`,
    data: {
      date,
      time,
      type: "time-slot",
    },
  });
  
  return (
    <div
      ref={setNodeRef}
      className={mergeClasses(styles.dropZone, (isOver || isActive) && styles.dropZoneActive)}
      style={{
        top: `${(hour - MIN_HOUR) * HOUR_HEIGHT}px`,
        zIndex: isOver ? 1 : 0,
      }}
    />
  );
};

export const DayColumn: React.FC<DayColumnProps> = React.memo(({
  date,
  meals,
  onRemoveMeal,
  isPast = false,
}) => {
  const styles = useStyles();
  const [activeDropHour, _setActiveDropHour] = React.useState<number | null>(null);
  
  // Flatten meals for display
  const allMeals = React.useMemo(() => {
    const flattened: Array<{ 
      id: string; 
      meal: MealItem & { recipe?: Record<string, unknown> }; 
      time: string; 
      index: number 
    }> = [];
    
    meals.forEach(timeSlot => {
      timeSlot.meals.forEach((meal, index) => {
        flattened.push({
          id: `${date}-${timeSlot.time}-${index}`,
          meal,
          time: timeSlot.time,
          index,
        });
      });
    });
    
    return flattened;
  }, [meals, date]);
  
  return (
    <div
      className={styles.column}
      data-day={date}
      style={{ opacity: isPast ? 0.6 : 1 }}
    >
      {/* Hour grid lines */}
      {HOURS.map(hour => (
        <div
          key={hour}
          className={styles.hourSlot}
          style={{ top: `${(hour - MIN_HOUR) * HOUR_HEIGHT}px` }}
        />
      ))}
      
      {/* Drop zones for each hour */}
      {HOURS.map(hour => (
        <DropZone
          key={`drop-${hour}`}
          date={date}
          hour={hour}
          isActive={activeDropHour === hour}
        />
      ))}
      
      {/* Sortable meal cards */}
      <SortableContext 
        items={allMeals.map(meal => meal.id)} 
        strategy={verticalListSortingStrategy}
      >
        {allMeals.map(({ id, meal, time, index }) => {
          const recipe = meal.recipe as { title?: string; emoji?: string } | undefined;
          
          return (
            <MealCard
              key={id}
              id={id}
              recipeId={meal.recipeId}
              title={recipe?.title ?? 'Unknown Recipe'}
              emoji={recipe?.emoji}
              time={time}
              duration={meal.duration ?? 60}
              position={getTimePosition(time)}
              onRemove={() => onRemoveMeal(time, index)}
              date={date}
              mealIndex={index}
            />
          );
        })}
      </SortableContext>
    </div>
  );
});

DayColumn.displayName = 'DayColumn';