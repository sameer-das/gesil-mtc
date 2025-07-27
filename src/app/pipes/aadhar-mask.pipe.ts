import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aadharMask'
})
export class AadharMaskPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): unknown {
    if(!value)
      return value;
    else {
      return `**** **** ${value.slice(-4)}`
    }
  }

}
