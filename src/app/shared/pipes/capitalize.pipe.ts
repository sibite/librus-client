import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {

  transform(value: string, ...args: any): string {
    if (!value) return null;
    return '' + value?.substr(0, 1).toUpperCase() + value?.substr(1);
  }
}
