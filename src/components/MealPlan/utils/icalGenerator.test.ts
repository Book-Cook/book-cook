/**
 * Unit tests for iCal generation utilities
 */
import {
  formatICalDate,
  parseTimeToDate,
  generateEventUID,
  mealPlansToICalEvents,
  generateICalContent
} from './icalGenerator';

import type { MealPlanWithRecipes } from '../../../clientToServer/types';

describe('icalGenerator', () => {
  describe('formatICalDate', () => {
    it('should format date in iCal format', () => {
      const date = new Date('2024-03-15T14:30:00.000Z');
      expect(formatICalDate(date)).toBe('20240315T143000Z');
    });

    it('should handle dates with single digit months and days', () => {
      const date = new Date('2024-01-05T09:00:00.000Z');
      expect(formatICalDate(date)).toBe('20240105T090000Z');
    });
  });

  describe('parseTimeToDate', () => {
    it('should combine date string and time string', () => {
      const result = parseTimeToDate('2024-03-15', '14:30');
      expect(result.toISOString()).toBe('2024-03-15T14:30:00.000Z');
    });

    it('should handle time without minutes', () => {
      const result = parseTimeToDate('2024-03-15', '09');
      expect(result.toISOString()).toBe('2024-03-15T09:00:00.000Z');
    });

    it('should handle missing minutes in time string', () => {
      const result = parseTimeToDate('2024-03-15', '14:');
      expect(result.toISOString()).toBe('2024-03-15T14:00:00.000Z');
    });
  });

  describe('generateEventUID', () => {
    it('should generate unique UID for events', () => {
      const uid = generateEventUID('2024-03-15', '14:30', 'recipe123', 0);
      expect(uid).toBe('meal-2024-03-15-1430-recipe123-0@book-cook.app');
    });

    it('should handle different indices', () => {
      const uid1 = generateEventUID('2024-03-15', '14:30', 'recipe123', 0);
      const uid2 = generateEventUID('2024-03-15', '14:30', 'recipe123', 1);
      
      expect(uid1).not.toBe(uid2);
      expect(uid1).toContain('-0@');
      expect(uid2).toContain('-1@');
    });
  });

  describe('mealPlansToICalEvents', () => {
    const mockMealPlans: MealPlanWithRecipes[] = [
      {
        _id: '1',
        date: '2024-03-15',
        meals: {
          timeSlots: [
            {
              time: '09:00',
              meals: [
                {
                  recipeId: 'recipe1',
                  duration: 60,
                  servings: 2,
                  recipe: { title: 'Pancakes', emoji: '🥞' }
                }
              ]
            },
            {
              time: '12:00',
              meals: [
                {
                  recipeId: 'recipe2',
                  duration: 45,
                  servings: 1,
                  recipe: { title: 'Salad', emoji: '🥗' }
                },
                {
                  recipeId: 'recipe3',
                  duration: 30,
                  servings: 1,
                  recipe: { title: 'Soup', emoji: '🍲' }
                }
              ]
            }
          ]
        },
        userId: 'user1'
      }
    ];

    it('should convert time slot meals to iCal events', () => {
      const events = mealPlansToICalEvents(mockMealPlans);

      expect(events).toHaveLength(3);
      
      expect(events[0]).toMatchObject({
        uid: 'meal-2024-03-15-0900-recipe1-0@book-cook.app',
        dtstart: '20240315T090000Z',
        dtend: '20240315T100000Z',
        summary: '🥞 Pancakes',
        description: 'Meal planning: Pancakes\nServings: 2\nDuration: 60 minutes',
        location: 'Kitchen'
      });
      
      expect(events[1]).toMatchObject({
        uid: 'meal-2024-03-15-1200-recipe2-0@book-cook.app',
        dtstart: '20240315T120000Z',
        dtend: '20240315T124500Z',
        summary: '🥗 Salad'
      });
    });

    it('should handle legacy meal types', () => {
      const legacyMealPlan: MealPlanWithRecipes[] = [
        {
          _id: '2',
          date: '2024-03-16',
          meals: {
            breakfast: {
              recipeId: 'recipe4',
              servings: 1,
              recipe: { title: 'Oatmeal', emoji: '🥣' }
            },
            dinner: {
              recipeId: 'recipe5',
              servings: 2,
              recipe: { title: 'Pasta', emoji: '🍝' }
            }
          },
          userId: 'user1'
        }
      ];

      const events = mealPlansToICalEvents(legacyMealPlan);

      expect(events).toHaveLength(2);
      
      const breakfastEvent = events.find(e => e.summary.includes('breakfast'));
      expect(breakfastEvent).toMatchObject({
        dtstart: '20240316T080000Z',
        dtend: '20240316T090000Z',
        summary: '🥣 Oatmeal (breakfast)',
        description: 'Meal planning: Oatmeal\nMeal type: breakfast\nServings: 1'
      });
    });

    it('should sort events chronologically', () => {
      const multipleDayPlans: MealPlanWithRecipes[] = [
        {
          _id: '3',
          date: '2024-03-16',
          meals: {
            timeSlots: [
              {
                time: '12:00',
                meals: [{ 
                  recipeId: 'recipe6', 
                  duration: 60,
                  recipe: { title: 'Lunch' }
                }]
              }
            ]
          },
          userId: 'user1'
        },
        {
          _id: '4',
          date: '2024-03-15',
          meals: {
            timeSlots: [
              {
                time: '18:00',
                meals: [{ 
                  recipeId: 'recipe7', 
                  duration: 60,
                  recipe: { title: 'Dinner' }
                }]
              }
            ]
          },
          userId: 'user1'
        }
      ];

      const events = mealPlansToICalEvents(multipleDayPlans);

      expect(events[0].dtstart).toBe('20240315T180000Z'); // Earlier date first
      expect(events[1].dtstart).toBe('20240316T120000Z'); // Later date second
    });

    it('should handle meals without recipe data', () => {
      const planWithoutRecipe: MealPlanWithRecipes[] = [
        {
          _id: '5',
          date: '2024-03-17',
          meals: {
            timeSlots: [
              {
                time: '10:00',
                meals: [{ 
                  recipeId: 'recipe8', 
                  duration: 30
                  // No recipe object
                }]
              }
            ]
          },
          userId: 'user1'
        }
      ];

      const events = mealPlansToICalEvents(planWithoutRecipe);

      expect(events).toHaveLength(1);
      expect(events[0].summary).toBe('🍽️ Recipe recipe8');
      expect(events[0].description).toContain('Recipe recipe8');
    });

    it('should handle default duration for meals without duration', () => {
      const planWithoutDuration: MealPlanWithRecipes[] = [
        {
          _id: '6',
          date: '2024-03-18',
          meals: {
            timeSlots: [
              {
                time: '11:00',
                meals: [{ 
                  recipeId: 'recipe9',
                  recipe: { title: 'Quick Snack' }
                  // No duration specified
                }]
              }
            ]
          },
          userId: 'user1'
        }
      ];

      const events = mealPlansToICalEvents(planWithoutDuration);

      expect(events[0].dtstart).toBe('20240318T110000Z');
      expect(events[0].dtend).toBe('20240318T120000Z'); // Default 60 minutes
      expect(events[0].description).toContain('Duration: 60 minutes');
    });
  });

  describe('generateICalContent', () => {
    const mockEvents = [
      {
        uid: 'test-event-1@book-cook.app',
        dtstart: '20240315T090000Z',
        dtend: '20240315T100000Z',
        summary: '🥞 Breakfast',
        description: 'Meal planning event',
        location: 'Kitchen'
      },
      {
        uid: 'test-event-2@book-cook.app',
        dtstart: '20240315T120000Z',
        dtend: '20240315T130000Z',
        summary: '🍔 Lunch',
        description: 'Another meal\\nMultiline description'
      }
    ];

    it('should generate valid iCal content', () => {
      const iCalContent = generateICalContent(mockEvents);

      expect(iCalContent).toContain('BEGIN:VCALENDAR');
      expect(iCalContent).toContain('VERSION:2.0');
      expect(iCalContent).toContain('PRODID:-//Book Cook//Meal Planner//EN');
      expect(iCalContent).toContain('END:VCALENDAR');
    });

    it('should include custom calendar name', () => {
      const iCalContent = generateICalContent(mockEvents, 'My Meal Plan');
      expect(iCalContent).toContain('X-WR-CALNAME:My Meal Plan');
    });

    it('should include all event properties', () => {
      const iCalContent = generateICalContent(mockEvents);

      expect(iCalContent).toContain('BEGIN:VEVENT');
      expect(iCalContent).toContain('UID:test-event-1@book-cook.app');
      expect(iCalContent).toContain('DTSTART:20240315T090000Z');
      expect(iCalContent).toContain('DTEND:20240315T100000Z');
      expect(iCalContent).toContain('SUMMARY:🥞 Breakfast');
      expect(iCalContent).toContain('DESCRIPTION:Meal planning event');
      expect(iCalContent).toContain('LOCATION:Kitchen');
      expect(iCalContent).toContain('END:VEVENT');
    });

    it('should handle events without optional properties', () => {
      const minimalEvents = [
        {
          uid: 'minimal-event@book-cook.app',
          dtstart: '20240315T150000Z',
          dtend: '20240315T160000Z',
          summary: 'Simple Event'
        }
      ];

      const iCalContent = generateICalContent(minimalEvents);

      expect(iCalContent).toContain('SUMMARY:Simple Event');
      expect(iCalContent).not.toContain('DESCRIPTION:');
      expect(iCalContent).not.toContain('LOCATION:');
    });

    it('should escape newlines in descriptions', () => {
      const iCalContent = generateICalContent(mockEvents);
      expect(iCalContent).toContain('DESCRIPTION:Another meal\\nMultiline description');
    });

    it('should use CRLF line endings', () => {
      const iCalContent = generateICalContent(mockEvents);
      expect(iCalContent).toContain('\r\n');
      expect(iCalContent.split('\r\n').length).toBeGreaterThan(1);
    });
  });
});