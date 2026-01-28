import { Pipe, PipeTransform } from '@angular/core';
import { numberToHangulMixed } from 'es-hangul';

@Pipe({
  name: 'koreanCurrency',
})
export class KoreanCurrencyPipe implements PipeTransform {
  transform(value?: number | string): string {
    if (value === undefined || value === null) {
      return '';
    }
    return numberToHangulMixed(+value, { spacing: true }) + '원';
  }
}
