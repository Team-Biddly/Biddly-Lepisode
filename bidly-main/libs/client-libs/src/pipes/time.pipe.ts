import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: any) {
    const current = Number(value.split(':')[0]);
    const prefix = current < 12 ? '오전' : '오후';

    return `${prefix} ${current === 0 ? 12 : current <= 12 ? current : current - 12}시`;
  }
}
