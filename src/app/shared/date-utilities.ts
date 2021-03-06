import * as moment from "moment";

export function convertLibrusDate(dateString: string): Date {
  let [date, time] = dateString.split(' ');
  time = time ?? '00:00:00';
  let segments: number[] = [...date.split('-'), ...time.split(':')].map(a => +a);
  segments[1] -= 1;

  return new Date(segments[0], segments[1], segments[2], segments[3], segments[4], segments[5]);
}


export function toDateString(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}


export function toMiddayDate(date: Date): Date {
  if (!date) return null;
  let midday = new Date(date.getTime());
  midday.setHours(12, 0, 0, 0);
  return midday;
}


export function toWeekStartDate(date: Date): Date {
  if (!date) return null;
  let midday = toMiddayDate(date);
  return new Date(midday.getTime() - ((midday.getDay() + 6) % 7) * 86400e3);
}


type dateStyle = 'long month' | 'long weekday' | 'long weekday-month' | 'normal' | 'time';

export function formatDate(date: Date, style: dateStyle = 'normal') {
  let options;
  switch (style) {
    case 'long weekday':
      options = {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }
      break;
    case 'long month':
      options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      break;
    case 'long weekday-month':
      options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      break;
    case 'time':
      options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
      break;
    case 'normal':
    default:
      options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }
    break;
  }

  return date.toLocaleString('pl-PL', options);
}


export function getRelativeDateText(date: Date) {
  moment.locale('pl');
  return moment().fromNow();
}
