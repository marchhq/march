import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';
import { Meet } from '../lib/@types/Items/Meet';

export function getCurrentWeekMeets(meets: Meet[] = []): Meet[] {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  return meets.filter(meet =>
    isWithinInterval(new Date(meet.metadata.start.dateTime), { start: weekStart, end: weekEnd })
  );
}

export function formatMeetDate(date: string): string {
  return format(new Date(date), 'EEE, MMM dd');
}

export function formatMeetTime(startTime: string, endTime: string): string {
  return `${format(new Date(startTime), 'HH:mm')} - ${format(new Date(endTime), 'HH:mm')}`;
}
