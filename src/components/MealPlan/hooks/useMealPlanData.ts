import { useQuery } from "@tanstack/react-query";

import type { CalendarView } from "../MealPlanCalendar/MealPlanCalendar.types";
import { formatDateString } from "../utils/formatDateString";

import type { MealPlanWithRecipes } from "../../../clientToServer/types/mealPlan.types";

interface UseMealPlanDataProps {
  view: CalendarView;
  currentDate: Date;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface MealPlanQueryResult {
  mealPlans: MealPlanWithRecipes[];
}

interface UseMealPlanDataReturn {
  dateRange: DateRange;
  mealPlansData: MealPlanQueryResult | undefined;
}

function getDateRange(view: CalendarView, currentDate: Date): DateRange {
  const start = new Date(currentDate);
  const end = new Date(currentDate);

  if (view === "day") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (view === "week") {
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
  }

  return {
    startDate: formatDateString(start),
    endDate: formatDateString(end),
  };
}

/**
 * Fetches meal plans for the current view and date range.
 */
export function useMealPlanData({
  view,
  currentDate,
}: UseMealPlanDataProps): UseMealPlanDataReturn {
  const dateRange = getDateRange(view, currentDate);

  const { data: mealPlansData } = useQuery<MealPlanQueryResult>({
    queryKey: ["mealPlans", dateRange.startDate, dateRange.endDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/meal-plans?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch meal plans");
      }
      return response.json();
    },
  });

  return { dateRange, mealPlansData };
}
