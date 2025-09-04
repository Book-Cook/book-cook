/**
 * Get initial scroll position to show current time
 */
export const getInitialScrollPosition = (minHour: number, hourHeight: number): number => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = minHour * 60;
  return Math.max(0, ((minutes - startMinutes - 120) / 60) * hourHeight);
};