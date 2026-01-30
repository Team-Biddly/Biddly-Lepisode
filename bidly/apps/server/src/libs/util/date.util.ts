import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

export type PeriodUnit =
  | 's'
  | 'm'
  | 'h'
  | 'd'
  | 'mo'
  | 'y'
  | 'S'
  | 'M'
  | 'H'
  | 'D'
  | 'MO'
  | 'Y';

export type PeriodString = `${number}${PeriodUnit}`;

@Injectable()
export class DateUtil {
  /**
   * 오늘 기준으로 주어진 기간을 더한 날짜를 가져옵니다.
   * @param {PeriodString} value 기간 초(s), 분(m), 일(d), 월(mo), 년(y)
   * @returns {Date} 주어진 기간을 더한 날짜
   */
  addPeriodToToday(value: PeriodString): Date {
    const periodUnit = value[value.length - 1] as PeriodUnit;
    const period = parseInt(value.substring(0, value.length - 1));

    if (periodUnit === 's' || periodUnit === 'S') {
      return dayjs().add(period, 'second').toDate();
    }

    if (periodUnit === 'm' || periodUnit === 'M') {
      return dayjs().add(period, 'minute').toDate();
    }

    if (periodUnit === 'h' || periodUnit === 'H') {
      return dayjs().add(period, 'hour').toDate();
    }

    if (periodUnit === 'd' || periodUnit === 'D') {
      return dayjs().add(period, 'day').toDate();
    }

    if (periodUnit === 'mo' || periodUnit === 'MO') {
      return dayjs().add(period, 'month').toDate();
    }

    if (periodUnit === 'y' || periodUnit === 'Y') {
      return dayjs().add(period, 'year').toDate();
    }
  }

  /**
   * 오늘 기준으로 주어진 기간을 뺀 날짜를 가져옵니다.
   * @param {PeriodString} value 기간 초(s), 분(m), 일(d), 월(mo), 년(y)
   * @returns {Date} 주어진 기간을 뺀 날짜
   */
  subtractPeriodFromToday(value: PeriodString): Date {
    const periodUnit = value[value.length - 1] as PeriodUnit;
    const period = parseInt(value.substring(0, value.length - 1));

    if (periodUnit === 's' || periodUnit === 'S') {
      return dayjs().subtract(period, 'second').toDate();
    }

    if (periodUnit === 'm' || periodUnit === 'M') {
      return dayjs().subtract(period, 'minute').toDate();
    }

    if (periodUnit === 'h' || periodUnit === 'H') {
      return dayjs().subtract(period, 'hour').toDate();
    }

    if (periodUnit === 'd' || periodUnit === 'D') {
      return dayjs().subtract(period, 'day').toDate();
    }

    if (periodUnit === 'mo' || periodUnit === 'MO') {
      return dayjs().subtract(period, 'month').toDate();
    }

    if (periodUnit === 'y' || periodUnit === 'Y') {
      return dayjs().subtract(period, 'year').toDate();
    }
  }

  /**
   * 주어진 날짜를 한글로 변환합니다.
   * @param {Date} date
   * @returns {string} 한글로 변환된 날짜 YYYY년 MM월 DD일
   */
  toKoreanDate(date: Date): string {
    return dayjs(date).format('YYYY년 MM월 DD일');
  }

  /**
   * 주어진 기간을 한글로 변환합니다.
   * @param {PeriodString} period 기간 7d, 1m, 1y
   * @returns {string} 한글로 변환된 기간 7일, 1개월, 1년
   */
  toKoreanPeriod(period: PeriodString): string {
    const periodUnit = period[period.length - 1] as PeriodUnit;
    const periodValue = parseInt(period.substring(0, period.length - 1));

    let suffix = '';

    if (periodUnit === 's' || periodUnit === 'S') {
      suffix = '초';
    }

    if (periodUnit === 'm' || periodUnit === 'M') {
      suffix = '분';
    }

    if (periodUnit === 'h' || periodUnit === 'H') {
      suffix = '시간';
    }

    if (periodUnit === 'd' || periodUnit === 'D') {
      suffix = '일';
    }

    if (periodUnit === 'mo' || periodUnit === 'MO') {
      suffix = '개월';
    }

    if (periodUnit === 'y' || periodUnit === 'Y') {
      suffix = '년';
    }

    return `${periodValue}${suffix}`;
  }
}
