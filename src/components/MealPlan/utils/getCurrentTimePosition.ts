/**
 * Get the current time position for the time indicator line
 */
export const getCurrentTimePosition = (currentTime: Date, minHour: number, hourHeight: number): number | null => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  
  if (hours < minHour || hours > 22) {
    return null;
  }
  
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = minHour * 60;
  return ((totalMinutes - startMinutes) / 60) * hourHeight;
};