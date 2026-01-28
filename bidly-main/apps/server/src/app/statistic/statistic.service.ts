import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatisticDTO, UserStatisticDTO } from './dtos/statistic.dto';
import dayjs from 'dayjs';
import { _ } from '@faker-js/faker/dist/airline-CLphikKp';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}

  async findStatistic(): Promise<StatisticDTO> {
    const [today, week, threeDays] = await Promise.all([
      this.findJoinUsersInToday(),
      this.findJoinUsersInWeek(),
      this.findJoinUsersInThreeDays(),
    ]);

    return {
      user: {
        today,
        week,
        threeDays,
      },
      bid: {
        notices: 0,
        plans: 0,
        specs: 0,
      },
    };
  }

  async findUserStatisticByYear(
    year: string | number,
  ): Promise<UserStatisticDTO> {
    // 1. 최초로 가입한 사용자의 가입 날짜 조회

    // 2. 최후로 가입한 사용자의 가입 날짜 조회

    // 3. 년도별 가입자 수를 조회하고, `reduce`를 사용해 API 규격에 맞게 변경
    //   - 1월 부터 12월까지 분리해서 저장 -> xaxis: 2025-01 ~ 2025-12, data: 1, 2, 3, 4

    return null;
  }

  private async findJoinUsersInToday() {
    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
  }

  private async findJoinUsersInWeek() {
    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
  }

  private async findJoinUsersInThreeDays() {
    return this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 3)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
  }

  /**
   * 일자별로 가입자 수를 구합니다.
   * @param startDate
   * @param endDate
   */
  // async getSignUpUsersByDate(
  //   startDate: string, // YYYY-MM-DD 형식
  //   endDate: string, // YYYY-MM-DD 형식
  // ): Promise<[number, number][]> {
  //   const _startDate = dayjs(startDate).startOf('day'); // 2025-08-19
  //   const _endDate = dayjs(endDate).endOf('day'); // 2025-08-31

  //   const count = _endDate.diff(_startDate, 'day') + 1; // 13일

  //   const result: [number, number][] = [];
  //   for (let i = 0; i < count; i++) {
  //     const date = _startDate.add(i, 'day');
  //     const users = await this.prisma.user.count({
  //       where: {
  //         createdAt: {
  //           gte: date.startOf('day').toDate(), // gte: greater than or equal to : 이상
  //           lt: date.endOf('day').toDate(), // lt: less than : 미만
  //         },
  //       },
  //     });

  //     result.push([date.valueOf(), users]);
  //   }

  //   return result;
  // }
  async getSignUpUsersByDate(
    startDate: string,
    endDate: string,
  ): Promise<[number, number][]> {
    const _startDate = dayjs(startDate).startOf('day');
    const _endDate = dayjs(endDate).endOf('day');

    const count = _endDate.diff(_startDate, 'day') + 1;

    const promises: Promise<[number, number]>[] = [];

    for (let i = 0; i < count; i++) {
      const date = _startDate.add(i, 'day');

      const p = this.prisma.user
        .count({
          where: {
            createdAt: {
              gte: date.startOf('day').toDate(),
              lt: date.endOf('day').toDate(),
            },
          },
        })
        .then((users) => [date.valueOf(), users] as [number, number]);

      promises.push(p);
    }

    return Promise.all(promises);
  }
}
