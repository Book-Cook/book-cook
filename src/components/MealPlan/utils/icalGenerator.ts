/**
 * iCal generation utilities for meal plan calendar sync
 */
import type { MealPlanWithRecipes } from "../../../clientToServer/types";
import { mealTypeToTime } from "../../../utils/timeSlots";

export type ICalEvent = {
  uid: string;
  dtstart: string;
  dtend: string;
  summary: string;
  description?: string;
  location?: string;
  rrule?: string;
};

/**
 * Format date for iCal (YYYYMMDDTHHMMSSZ)
 */
export function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Parse time string (HH:MM) and combine with date
 */
export function parseTimeToDate(dateStr: string, timeStr: string): Date {
  const date = new Date(`${dateStr  }T00:00:00.000Z`);
  const [hours, minutes] = timeStr.split(':').map(Number);
  date.setUTCHours(hours, minutes || 0, 0, 0);
  return date;
}

/**
 * Generate a unique ID for calendar events
 */
export function generateEventUID(date: string, time: string, recipeId: string, index: number): string {
  return `meal-${date}-${time.replace(':', '')}-${recipeId}-${index}@book-cook.app`;
}

/**
 * Convert meal plan data to iCal events
 */
export function mealPlansToICalEvents(mealPlans: MealPlanWithRecipes[]): ICalEvent[] {
  const events: ICalEvent[] = [];

  mealPlans.forEach(plan => {
    const { date, meals } = plan;

    // Handle time slots
    if (meals.timeSlots && Array.isArray(meals.timeSlots)) {
      meals.timeSlots.forEach(slot => {
        slot.meals.forEach((meal, index) => {
          const startDate = parseTimeToDate(date, slot.time);
          const endDate = new Date(startDate.getTime() + (meal.duration || 60) * 60 * 1000);
          
          const recipe = meal.recipe as any;
          const title = recipe?.title || `Recipe ${meal.recipeId}`;
          const emoji = recipe?.emoji || '🍽️';
          
          events.push({
            uid: generateEventUID(date, slot.time, meal.recipeId, index),
            dtstart: formatICalDate(startDate),
            dtend: formatICalDate(endDate),
            summary: `${emoji} ${title}`,
            description: `Meal planning: ${title}\nServings: ${meal.servings || 1}\nDuration: ${meal.duration || 60} minutes`,
            location: 'Kitchen'
          });
        });
      });
    }

    // Handle legacy meal types
    const legacyMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

    legacyMealTypes.forEach((mealType) => {
      const meal = meals[mealType as keyof typeof meals];
      if (meal && typeof meal === 'object' && 'recipeId' in meal) {
        const defaultTime = mealTypeToTime(mealType);
        const startDate = parseTimeToDate(date, defaultTime);
        const endDate = new Date(startDate.getTime() + (meal.duration || 60) * 60 * 1000);
        
        const recipe = meal.recipe as any;
        const title = recipe?.title || `Recipe ${meal.recipeId}`;
        const emoji = recipe?.emoji || '🍽️';
        
        events.push({
          uid: generateEventUID(date, defaultTime, meal.recipeId, 0),
          dtstart: formatICalDate(startDate),
          dtend: formatICalDate(endDate),
          summary: `${emoji} ${title} (${mealType})`,
          description: `Meal planning: ${title}\nMeal type: ${mealType}\nServings: ${meal.servings || 1}`,
          location: 'Kitchen'
        });
      }
    });
  });

  return events.sort((a, b) => a.dtstart.localeCompare(b.dtstart));
}

/**
 * Generate complete iCal content
 */
export function generateICalContent(events: ICalEvent[], calendarName = 'Book Cook Meal Plan'): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Book Cook//Meal Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calendarName}`,
    'X-WR-TIMEZONE:UTC',
    'X-WR-CALDESC:Your personalized meal planning calendar from Book Cook'
  ];

  events.forEach(event => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTART:${event.dtstart}`,
      `DTEND:${event.dtend}`,
      `SUMMARY:${event.summary}`,
      `CREATED:${formatICalDate(new Date())}`,
      `LAST-MODIFIED:${formatICalDate(new Date())}`,
      `DTSTAMP:${formatICalDate(new Date())}`
    );

    if (event.description) {
      lines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
    }
    
    if (event.location) {
      lines.push(`LOCATION:${event.location}`);
    }
    
    if (event.rrule) {
      lines.push(`RRULE:${event.rrule}`);
    }

    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  
  return lines.join('\r\n');
}