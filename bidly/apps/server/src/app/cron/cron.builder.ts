import { CronDTO } from './dtos/cron.dto';

export class CronBuilder extends CronDTO {
  private cron: Partial<CronDTO>;

  constructor() {
    super();
    this.cron = new CronDTO();
  }

  setSecond(second: number | string): CronBuilder {
    this.cron.second = second;
    return this;
  }

  setMinute(minute: number | string): CronBuilder {
    this.cron.minute = minute;
    return this;
  }

  setHour(hour: number | string): CronBuilder {
    this.cron.hour = hour;
    return this;
  }

  setDay(day: number | string): CronBuilder {
    this.cron.day = day;
    return this;
  }

  setMonth(month: number | string): CronBuilder {
    this.cron.month = month;
    return this;
  }

  setDayOfWeek(dayOfWeek: number | string): CronBuilder {
    this.cron.dayOfWeek = dayOfWeek;
    return this;
  }

  build(): Partial<CronDTO> {
    return this.cron;
  }

  public everyYearCron(): CronDTO {
    return new CronBuilder()
      .setSecond(0)
      .setMinute(0)
      .setHour(0)
      .setDay(1)
      .setMonth(1)
      .build();
  }

  public everyMonthCron(): CronDTO {
    return new CronBuilder()
      .setSecond(0)
      .setMinute(0)
      .setHour(0)
      .setDay(1)
      .build();
  }

  public everyDayCron(): CronDTO {
    return new CronBuilder().setSecond(0).setMinute(0).setHour(0).build();
  }

  public everyHourCron(): CronDTO {
    return new CronBuilder().setSecond(0).setMinute(0).build();
  }

  public everyMinuteCron(): CronDTO {
    return new CronBuilder().setSecond(0).build();
  }

  public everySecondCron(): CronDTO {
    return new CronBuilder().build();
  }
}
