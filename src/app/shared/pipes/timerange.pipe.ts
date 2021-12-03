import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerange'
})
export class TimerangePipe implements PipeTransform {

  transform(event: any, fullDayText: string): string {
    if (event.TimeFrom) {
      return `${event.TimeFrom.substr(0, 5)} \u2013 ${event.TimeTo.substr(0, 5)}`;
    }
    else {
      return fullDayText;
    }
  }

}
