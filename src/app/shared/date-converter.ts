export function convertLibrusDate(dateString) {
  let [date, time] = dateString.split(' ');
  time = time ?? '00:00:00';
  let segments: number[] = [...date.split('-'), ...time.split(':')].map(a => +a);
  segments[1] -= 1;

  return new Date(segments[0], segments[1], segments[2], segments[3], segments[4], segments[5]);
}
