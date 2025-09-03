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

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

export const formatDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

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

export const getInitialScrollPosition = (minHour: number, hourHeight: number): number => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = minHour * 60;
  const scrollPosition = ((minutes - startMinutes) / 60) * hourHeight;
  return Math.max(0, scrollPosition - 100);
};