import { Injectable } from '@nestjs/common';
import { Prisma, Visitor } from '@prisma/client';
import * as axios from 'axios';
import dayjs from 'dayjs';
import { PrismaService } from '../../prisma/prisma.service';
import { FindVisitorDTO } from './dtos/find-visitor.dto';
import { SearchVisitorDTO } from './dtos/search-visitor.dto';
import { VisitorDeviceTypeDTO } from './dtos/visitor-chart.dto';
import { RequestVisitorDTO } from './dtos/visitor.dto';

@Injectable()
export class VisitorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * User-Agent 분석하여 디바이스 정보 추출
   * @param userAgent
   * @returns
   */
  private parseUserAgent(userAgent: string) {
    const uap = require('ua-parser-js');
    const result = uap(userAgent);

    // 디바이스 정보 추출
    const device = result.device.type || 'desktop'; // 디바이스 타입 (mobile, tablet, desktop 등)
    const os = result.os.name; // 운영 체제 정보 (Windows, Android, iOS 등)
    const browser = result.browser.name; // 브라우저 이름 (Chrome, Firefox 등)

    return { device, os, browser };
  }

  /**
   * 공통 방문자 데이터 조회 및 그룹화 함수
   * @param startDate
   * @param endDate
   * @param groupBy
   * @returns
   */
  private async getVisitorsGroupedBy(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'month',
  ) {
    const items = await this.prisma.visitor.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // 날짜 포맷을 'YYYY-MM-DD' 또는 'YYYY-MM'으로 설정
    const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';

    // 방문자 수를 그룹화하여 카운트
    const groupedCounts = items.reduce(
      (acc, item) => {
        const key = dayjs(item.createdAt).format(dateFormat);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      dates: Object.keys(groupedCounts),
      counts: Object.values(groupedCounts),
    };
  }

  /**
   * 인기 페이지 조회 및 그룹화 함수
   * @param startDate
   * @param endDate
   * @param groupBy
   * @returns
   */
  private async getPopularPagesGroupedBy(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'month',
  ) {
    const items = await this.prisma.visitor.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // 날짜별 URL 방문자 수를 그룹화
    const groupedCounts = items.reduce(
      (acc, item) => {
        const dateKey = dayjs(item.createdAt).format(
          groupBy === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD',
        );
        const key = `${item.pageUrl}_${dateKey}`;

        acc[key] = (acc[key] || 0) + 1; // 방문자 수 증가
        return acc;
      },
      {} as Record<string, number>,
    );

    // URL별 방문자 수를 합산하여 최종 정리
    const urlTotalCounts = new Map<string, { total: number; date: string }>();

    Object.entries(groupedCounts).forEach(([key, count]) => {
      const [url, date] = key.split('_');

      if (!urlTotalCounts.has(url)) {
        urlTotalCounts.set(url, { total: 0, date });
      }
      urlTotalCounts.get(url)!.total += count;
    });

    // 방문자 수 기준으로 정렬 후 상위 10개 선택
    const sortedPages = [...urlTotalCounts.entries()]
      .sort((a, b) => b[1].total - a[1].total) // 방문자 수 내림차순 정렬
      .slice(0, 10); // 상위 10개 선택

    return {
      pageUrls: sortedPages.map(([url]) => url),
      counts: sortedPages.map(([_, data]) => data.total),
      dates: sortedPages.map(([_, data]) => data.date),
    };
  }

  /**
   * 디바이스 유형 조회 및 그룹화 함수
   * @param startDate
   * @param endDate
   * @param groupBy
   * @returns
   */
  private async getDeviceTypeGroupedBy(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'month',
  ) {
    const items = await this.prisma.visitor.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        device: true,
        os: true,
        browser: true,
      },
    });

    // 날짜별 방문자 수를 그룹화
    const groupedCounts = items.reduce(
      (acc, item) => {
        const dateKey = dayjs(item.createdAt).format(
          groupBy === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD',
        );

        if (!acc[dateKey]) {
          acc[dateKey] = {
            total: 0,
            deviceTypes: new Map<string, number>(),
            oses: new Map<string, number>(),
            browsers: new Map<string, number>(),
          };
        }

        acc[dateKey].total += 1;

        // 카운트 합산 (중복이 있을 때)
        acc[dateKey].deviceTypes.set(
          item.device,
          (acc[dateKey].deviceTypes.get(item.device) || 0) + 1,
        );
        acc[dateKey].oses.set(
          item.os,
          (acc[dateKey].oses.get(item.os) || 0) + 1,
        );
        acc[dateKey].browsers.set(
          item.browser,
          (acc[dateKey].browsers.get(item.browser) || 0) + 1,
        );

        return acc;
      },
      {} as Record<
        string,
        {
          total: number;
          deviceTypes: Map<string, number>;
          oses: Map<string, number>;
          browsers: Map<string, number>;
        }
      >,
    );

    // 날짜별 방문자 수 및 장치 정보 정리
    const sortedDates = Object.entries(groupedCounts).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
    ); // 날짜 오름차순 정렬

    const devices: VisitorDeviceTypeDTO = {
      counts: [],
      labels: [],
    };
    const oses: VisitorDeviceTypeDTO = {
      counts: [],
      labels: [],
    };
    const browsers: VisitorDeviceTypeDTO = {
      counts: [],
      labels: [],
    };

    sortedDates.map(([_, data]) => {
      // 중복된 device, os, browser에 대한 합산된 결과 계산
      const _devices = Object.fromEntries(data.deviceTypes);
      const _oses = Object.fromEntries(data.oses);
      const _browsers = Object.fromEntries(data.browsers);

      // 중복된 device, os, browser 정보를 합산
      Object.entries(_devices).forEach(([device, count]) => {
        const existingIndex = devices.labels.indexOf(device);
        if (existingIndex === -1) {
          devices.labels.push(device);
          devices.counts.push(count);
        } else {
          devices.counts[existingIndex] += count; // 기존에 있으면 카운트 합산
        }
      });

      Object.entries(_oses).forEach(([os, count]) => {
        const existingIndex = oses.labels.indexOf(os);
        if (existingIndex === -1) {
          oses.labels.push(os);
          oses.counts.push(count);
        } else {
          oses.counts[existingIndex] += count; // 기존에 있으면 카운트 합산
        }
      });

      Object.entries(_browsers).forEach(([browser, count]) => {
        const existingIndex = browsers.labels.indexOf(browser);
        if (existingIndex === -1) {
          browsers.labels.push(browser);
          browsers.counts.push(count);
        } else {
          browsers.counts[existingIndex] += count; // 기존에 있으면 카운트 합산
        }
      });
    });

    return {
      devices,
      oses,
      browsers,
    };
  }

  /**
   * 유입 페이지 조회 및 그룹화 함수
   * @param startDate
   * @param endDate
   * @param groupBy
   * @returns
   */
  private async getIncomingPageGroupedBy(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'month',
  ): Promise<any> {
    const items = await this.prisma.visitor.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // 날짜별 URL 방문자 수를 그룹화
    const groupedCounts = items.reduce(
      (acc, item) => {
        const dateKey = dayjs(item.createdAt).format(
          groupBy === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD',
        );
        item.referrer =
          item.referrer === 'direct' ? '직접 방문' : item.referrer;
        const key = `${item.referrer}_${dateKey}`;

        acc[key] = (acc[key] || 0) + 1; // 방문자 수 증가
        return acc;
      },
      {} as Record<string, number>,
    );

    // URL별 방문자 수를 합산하여 최종 정리
    const urlTotalCounts = new Map<string, { total: number; date: string }>();

    Object.entries(groupedCounts).forEach(([key, count]) => {
      const [url, date] = key.split('_');

      if (!urlTotalCounts.has(url)) {
        urlTotalCounts.set(url, { total: 0, date });
      }
      urlTotalCounts.get(url)!.total += count;
    });

    // 방문자 수 기준으로 정렬 후 상위 10개 선택
    const sortedPages = [...urlTotalCounts.entries()]
      .sort((a, b) => b[1].total - a[1].total) // 방문자 수 내림차순 정렬
      .slice(0, 5); // 상위 5개 선택

    return {
      referrers: sortedPages.map(([url]) => url),
      counts: sortedPages.map(([_, data]) => data.total),
      dates: sortedPages.map(([_, data]) => data.date),
    };
  }

  async findTotalVisitors(option: FindVisitorDTO): Promise<any> {
    const { type, endAt, startAt } = option;

    if (startAt && endAt) {
      const startDate = dayjs(startAt).toDate();
      const endDate = dayjs(endAt).toDate();
      return await this.getVisitorsGroupedBy(startDate, endDate, 'day');
    }

    if (type) {
      switch (type) {
        case 'week': {
          const startDate = dayjs(startAt).startOf('week').toDate();
          const endDate = dayjs(endAt).endOf('week').toDate();
          return await this.getVisitorsGroupedBy(startDate, endDate, 'day');
        }
        case 'month': {
          const currentMonth = dayjs().month();
          const currentYear = dayjs().year();
          const startDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .startOf('month')
            .toDate();
          const endDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .endOf('month')
            .toDate();
          return await this.getVisitorsGroupedBy(startDate, endDate, 'day');
        }
        case 'year': {
          const currentYear = dayjs().year();
          const startDate = dayjs().year(currentYear).startOf('year').toDate();
          const endDate = dayjs().year(currentYear).endOf('year').toDate();
          return await this.getVisitorsGroupedBy(startDate, endDate, 'month');
        }
      }
    }
  }

  async findPopularPage(option: FindVisitorDTO): Promise<any> {
    const { type, endAt, startAt } = option;

    if (startAt && endAt) {
      const startDate = dayjs(startAt).toDate();
      const endDate = dayjs(endAt).toDate();
      return await this.getPopularPagesGroupedBy(startDate, endDate, 'day');
    }

    if (type) {
      switch (type) {
        case 'week': {
          const startDate = dayjs(startAt).startOf('week').toDate();
          const endDate = dayjs(endAt).endOf('week').toDate();
          return await this.getPopularPagesGroupedBy(startDate, endDate, 'day');
        }
        case 'month': {
          const currentMonth = dayjs().month();
          const currentYear = dayjs().year();
          const startDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .startOf('month')
            .toDate();
          const endDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .endOf('month')
            .toDate();
          return await this.getPopularPagesGroupedBy(startDate, endDate, 'day');
        }
        case 'year': {
          const currentYear = dayjs().year();
          const startDate = dayjs().year(currentYear).startOf('year').toDate();
          const endDate = dayjs().year(currentYear).endOf('year').toDate();
          return await this.getPopularPagesGroupedBy(
            startDate,
            endDate,
            'month',
          );
        }
      }
    }
  }

  async findIncomingPage(option: FindVisitorDTO): Promise<any> {
    const { type, endAt, startAt } = option;

    if (startAt && endAt) {
      const startDate = dayjs(startAt).toDate();
      const endDate = dayjs(endAt).toDate();
      return await this.getIncomingPageGroupedBy(startDate, endDate, 'day');
    }

    if (type) {
      switch (type) {
        case 'week': {
          const startDate = dayjs(startAt).startOf('week').toDate();
          const endDate = dayjs(endAt).endOf('week').toDate();
          return await this.getIncomingPageGroupedBy(startDate, endDate, 'day');
        }
        case 'month': {
          const currentMonth = dayjs().month();
          const currentYear = dayjs().year();
          const startDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .startOf('month')
            .toDate();
          const endDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .endOf('month')
            .toDate();
          return await this.getIncomingPageGroupedBy(startDate, endDate, 'day');
        }
        case 'year': {
          const currentYear = dayjs().year();
          const startDate = dayjs().year(currentYear).startOf('year').toDate();
          const endDate = dayjs().year(currentYear).endOf('year').toDate();
          return await this.getIncomingPageGroupedBy(
            startDate,
            endDate,
            'month',
          );
        }
      }
    }
  }

  async findDeviceType(option: FindVisitorDTO): Promise<any> {
    const { type, endAt, startAt } = option;

    if (startAt && endAt) {
      const startDate = dayjs(startAt).toDate();
      const endDate = dayjs(endAt).toDate();
      return await this.getDeviceTypeGroupedBy(startDate, endDate, 'day');
    }

    if (type) {
      switch (type) {
        case 'week': {
          const startDate = dayjs(startAt).startOf('week').toDate();
          const endDate = dayjs(endAt).endOf('week').toDate();
          return await this.getDeviceTypeGroupedBy(startDate, endDate, 'day');
        }
        case 'month': {
          const currentMonth = dayjs().month();
          const currentYear = dayjs().year();
          const startDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .startOf('month')
            .toDate();
          const endDate = dayjs()
            .year(currentYear)
            .month(currentMonth)
            .endOf('month')
            .toDate();
          return await this.getDeviceTypeGroupedBy(startDate, endDate, 'day');
        }
        case 'year': {
          const currentYear = dayjs().year();
          const startDate = dayjs().year(currentYear).startOf('year').toDate();
          const endDate = dayjs().year(currentYear).endOf('year').toDate();
          return await this.getDeviceTypeGroupedBy(startDate, endDate, 'month');
        }
      }
    }
  }

  async searchVisitors(option: SearchVisitorDTO): Promise<[Visitor[], number]> {
    const { pageNo, pageSize, align, orderBy, query, endAt, startAt, type } =
      option;
    const where: Prisma.VisitorWhereInput = {};

    if (query) {
      where.OR = [
        { ip: { contains: query } },
        { nation: { contains: query } },
        { city: { contains: query } },
        { device: { contains: query } },
        { os: { contains: query } },
        { browser: { contains: query } },
      ];
    }

    if (startAt && endAt) {
      where.createdAt = {
        gte: startAt,
        lte: endAt,
      };
    } else if (type) {
      switch (type) {
        case 'week': {
          where.createdAt = {
            gte: dayjs(startAt).startOf('week').toDate(),
            lte: dayjs(endAt).endOf('week').toDate(),
          };
          break;
        }
        case 'month': {
          where.createdAt = {
            gte: dayjs(startAt).startOf('month').toDate(),
            lte: dayjs(endAt).endOf('month').toDate(),
          };
          break;
        }
        case 'year': {
          where.createdAt = {
            gte: dayjs(startAt).startOf('year').toDate(),
            lte: dayjs(endAt).endOf('year').toDate(),
          };
          break;
        }
      }
    }

    const items = await this.prisma.visitor.findMany({
      where,
      orderBy: {
        [orderBy]: align,
      },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });

    const count = await this.prisma.visitor.count({
      where,
    });

    return [items, count];
  }

  async createVisitor(
    body: RequestVisitorDTO,
    userAgent: string,
  ): Promise<Visitor> {
    // IP 기반으로 Geolocation 정보 가져오기 (예시: ip-api 사용)
    const { browser, device, os } = this.parseUserAgent(userAgent);

    const visitor = this.prisma.visitor.create({
      data: {
        browser,
        device,
        os,
        ip: body.ip,
        pageUrl: body.pageUrl,
        referrer: body.referrer,
        nation: body.nation || 'Unknown',
        city: body.city || 'Unknown',
      },
    });

    return visitor;
  }
}
