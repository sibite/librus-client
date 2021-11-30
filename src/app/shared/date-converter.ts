export function convertLibrusDate(dateString: string) {
  let [date, time] = dateString.split(' ');
  time = time ?? '00:00:00';
  let segments: number[] = [...date.split('-'), ...time.split(':')].map(a => +a);
  segments[1] -= 1;

  return new Date(segments[0], segments[1], segments[2], segments[3], segments[4], segments[5]);
}

type dateStyle = 'long month' | 'long weekday' | 'normal';

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
    case 'normal':
      options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }
    break;
  }

  return date.toLocaleDateString('pl-PL', options);
}
