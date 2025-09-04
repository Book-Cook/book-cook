import { useState, useCallback } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';

import type { DraggedRecipe, MealDragDropHandlers } from '../types';

export function useMealDragDrop(handlers: MealDragDropHandlers, view: string) {
  const [draggedRecipe, setDraggedRecipe] = useState<DraggedRecipe | null>(null);

  const handleDragStart = useCallback((event: { 
    active: { 
      id: string | number;
      data: { current?: { 
        recipe?: DraggedRecipe; 
        type?: string; 
        title?: string; 
        emoji?: string; 
      } } 
    } 
  }) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.recipe) {
      setDraggedRecipe(activeData.recipe);
    } else if (activeData?.type === "meal-card") {
      setDraggedRecipe({
        id: active.id as string,
        title: activeData.title || 'Unknown Recipe',
        emoji: activeData.emoji,
      });
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setDraggedRecipe(null);
      return;
    }

    // Handle meal reordering within same time slot
    if (active.data.current?.type === "meal-card" && over.data.current?.type === "meal-card") {
      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData?.date === overData?.date && 
          activeData?.time === overData?.time && 
          activeData?.mealIndex !== overData?.mealIndex) {
        
        handlers.reorderMealMutation.mutate({
          date: activeData.date,
          time: activeData.time,
          oldIndex: activeData.mealIndex,
          newIndex: overData.mealIndex
        });
      }
      setDraggedRecipe(null);
      return;
    }

    const recipe = active.data.current?.recipe;
    const dropTarget = over.data.current;

    if (recipe && dropTarget?.date) {
      // If we have a specific time slot, use it directly
      if (dropTarget.time) {
        const payload: Record<string, unknown> = {
          date: dropTarget.date,
          recipeId: recipe.id,
          servings: 1,
          time: dropTarget.time,
          duration: 60,
        };

        handlers.addMealMutation.mutate(payload);
      } 
      // If it's a month view day, week view drop zone, or general day drop - show time picker
      else if (dropTarget.type === "month-day" || dropTarget.type === "week-day" || view === "week" || view === "month") {
        handlers.setPendingMeal({ recipe, date: dropTarget.date });
        handlers.setShowTimePicker(true);
        handlers.setSidebarOpen(false);
      }
      // Legacy meal type support
      else if (dropTarget.mealType) {
        const payload: Record<string, unknown> = {
          date: dropTarget.date,
          recipeId: recipe.id,
          servings: 1,
          mealType: dropTarget.mealType,
        };

        handlers.addMealMutation.mutate(payload);
      }
    }

    setDraggedRecipe(null);
  }, [handlers, view]);

  return {
    draggedRecipe,
    handleDragStart,
    handleDragEnd,
    setDraggedRecipe,
  };
}