import { getMealsForDate, flattenMeals } from './mealUtils';

import type { MealPlanWithRecipes } from '../../../clientToServer/types';

describe('mealUtils', () => {
  describe('getMealsForDate', () => {
    const mockMealPlans: MealPlanWithRecipes[] = [
      {
        _id: '1',
        date: '2024-01-15',
        meals: {
          timeSlots: [
            {
              time: '09:00',
              meals: [{ recipeId: 'recipe1', duration: 60 }],
            },
            {
              time: '13:00',
              meals: [{ recipeId: 'recipe2', duration: 45 }],
            },
          ],
          breakfast: { recipeId: 'breakfast-recipe', duration: 30 },
          lunch: undefined,
          dinner: { recipeId: 'dinner-recipe', duration: 60 },
          snack: undefined,
        },
        userId: 'user1',
      },
    ];

    it('should return empty array when no meal plan exists for date', () => {
      const date = new Date('2024-01-16');
      const result = getMealsForDate(date, mockMealPlans);
      expect(result).toEqual([]);
    });

    it('should return time slots for matching date', () => {
      const date = new Date('2024-01-15');
      const result = getMealsForDate(date, mockMealPlans);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(slot => slot.time === '09:00')).toBe(true);
      expect(result.some(slot => slot.time === '13:00')).toBe(true);
    });

    it('should convert legacy meals to time slots', () => {
      const date = new Date('2024-01-15');
      const result = getMealsForDate(date, mockMealPlans);
      
      const breakfastSlot = result.find(slot => slot.time === '08:00');
      expect(breakfastSlot).toBeDefined();
      expect(breakfastSlot?.meals).toHaveLength(1);
      
      const dinnerSlot = result.find(slot => slot.time === '18:30');
      expect(dinnerSlot).toBeDefined();
      expect(dinnerSlot?.meals).toHaveLength(1);
    });

    it('should merge legacy meals with existing time slots', () => {
      const plansWithOverlap: MealPlanWithRecipes[] = [
        {
          _id: '2',
          date: '2024-01-17',
          meals: {
            timeSlots: [
              {
                time: '08:00',
                meals: [{ recipeId: 'existing-morning', duration: 30 }],
              },
            ],
            breakfast: { recipeId: 'legacy-breakfast', duration: 30 },
            lunch: undefined,
            dinner: undefined,
            snack: undefined,
          },
          userId: 'user1',
        },
      ];

      const date = new Date('2024-01-17');
      const result = getMealsForDate(date, plansWithOverlap);
      
      const morningSlot = result.find(slot => slot.time === '08:00');
      expect(morningSlot?.meals).toHaveLength(2);
    });

    it('should sort time slots chronologically', () => {
      const date = new Date('2024-01-15');
      const result = getMealsForDate(date, mockMealPlans);
      
      const times = result.map(slot => slot.time);
      const sortedTimes = [...times].sort();
      expect(times).toEqual(sortedTimes);
    });
  });

  describe('flattenMeals', () => {
    const mockTimeSlots = [
      {
        time: '09:00',
        meals: [
          { recipeId: 'recipe1', duration: 60 },
          { recipeId: 'recipe2', duration: 30 },
        ] as any[],
      },
      {
        time: '14:00',
        meals: [
          { recipeId: 'recipe3', duration: 45 },
        ] as any[],
      },
    ];

    it('should flatten nested meal structure', () => {
      const result = flattenMeals(mockTimeSlots, '2024-01-15');
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: '2024-01-15-09:00-0',
        meal: { recipeId: 'recipe1', duration: 60 },
        time: '09:00',
        index: 0,
      });
      expect(result[1]).toEqual({
        id: '2024-01-15-09:00-1',
        meal: { recipeId: 'recipe2', duration: 30 },
        time: '09:00',
        index: 1,
      });
      expect(result[2]).toEqual({
        id: '2024-01-15-14:00-0',
        meal: { recipeId: 'recipe3', duration: 45 },
        time: '14:00',
        index: 0,
      });
    });

    it('should handle empty time slots', () => {
      const result = flattenMeals([], '2024-01-15');
      expect(result).toEqual([]);
    });

    it('should generate unique IDs for each meal', () => {
      const result = flattenMeals(mockTimeSlots, '2024-01-15');
      const ids = result.map(item => item.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should preserve meal indices within time slots', () => {
      const result = flattenMeals(mockTimeSlots, '2024-01-15');
      
      const firstTimeSlotMeals = result.filter(item => item.time === '09:00');
      expect(firstTimeSlotMeals[0].index).toBe(0);
      expect(firstTimeSlotMeals[1].index).toBe(1);
      
      const secondTimeSlotMeals = result.filter(item => item.time === '14:00');
      expect(secondTimeSlotMeals[0].index).toBe(0);
    });
  });
});