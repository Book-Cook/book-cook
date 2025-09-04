/**
 * Check if a date has passed
 */
export const isPastDate = (date: Date, todayOverride?: boolean): boolean => {
  if (todayOverride) {return false;}
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};