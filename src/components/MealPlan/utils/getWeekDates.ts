/**
 * Get all dates for the current week (Sunday to Saturday)
 */
export const getWeekDates = (currentDate: Date): Date[] => {
  const dates: Date[] = [];
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
};