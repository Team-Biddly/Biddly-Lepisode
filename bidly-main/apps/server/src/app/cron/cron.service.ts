import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { CronDTO } from "./dtos/cron.dto";
import { JobDTO } from "./dtos/job.dto";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly scheduler: SchedulerRegistry) {}

  /**
   * 스케줄러에 작업을 등록합니다.
   * @param {JobDTO} data 작업 정보
   * @returns {void}
   */
  create(data: JobDTO): CronJob {
    const cronExpression = this.format(data.cron);

    const job = new CronJob(cronExpression, data.callback);

    this.scheduler.addCronJob(data.id, job);
    job.start();

    this.logger.debug(
      `스케줄러가 등록되었습니다. [${data.id}:${cronExpression}] `
    );
    return job;
  }

  /**
   * 스케쥴러에 등록된 작업을 중지합니다.
   * @param {string} id
   */
  stop(id: string): void {
    const job = this.scheduler.getCronJob(id);

    if (job) {
      job.stop();
      this.logger.debug(`스케줄러가 중지되었습니다. [${id}]`);
    }

    this.logger.warn(`스케줄러가 존재하지 않습니다. [${id}]`);
  }

  /**
   * 스케줄러에 등록된 작업을 재개합니다.
   */
  start(id: string): void {
    const job = this.scheduler.getCronJob(id);

    if (job) {
      job.start();
      this.logger.debug(`스케줄러가 재개되었습니다. [${id}]`);
    }

    this.logger.warn(`스케줄러가 존재하지 않습니다. [${id}]`);
  }

  /**
   * 스케줄러에 등록된 작업을 제거합니다.
   * @param {string} id
   */
  remove(id: string) {
    const job = this.scheduler.getCronJob(id);

    if (job) {
      this.scheduler.deleteCronJob(id);

      this.logger.debug(
        `스케줄러가 제거되었습니다. [${id}:${job.cronTime.source}]`
      );
    }

    this.logger.warn(`스케줄러가 존재하지 않습니다. [${id}]`);
  }

  /**
   * 스케쥴러에 등록된 작업을 조회합니다.
   * @param id
   */
  get(id: string) {
    const job = this.scheduler.getCronJob(id);

    if (!job) {
      return null;
    }

    const cron = this.parse(job.cronTime.source as string);

    return {
      name: id,
      cron,
      status: job.running ? "RUNNING" : "STOPPED",
    };
  }

  /**
   * 스케쥴러에 등록된 작업을 갱신합니다.
   * @param {JobDTO} data 작업 정보
   * @returns
   */
  update(data: JobDTO): void {
    this.remove(data.id);
    const job = this.create(data);

    this.logger.debug(
      `스케줄러가 갱신되었습니다. [${data.id}:${job.cronTime.source}]`
    );
  }

  /**
   * 스케쥴러를 초기화합니다.
   * @returns
   */
  clear() {
    this.scheduler.getCronJobs().forEach((job, id) => {
      this.scheduler.deleteCronJob(id);
    });

    this.logger.debug("스케줄러가 초기화되었습니다.");
  }

  /**
   * 크론 표현식을 CronDTO로 파싱합니다.
   * @param cronExpression 크론 표현식 (* * * * * *)
   * @returns {CronDTO} 파싱된 크론 객체 (second, minute, hour, day, month, dayOfWeek)
   */
  parse(cronExpression: string): CronDTO {
    const [second, minute, hour, day, month, dayOfWeek] =
      cronExpression.split(" ");

    return {
      second,
      minute,
      hour,
      day,
      month,
      dayOfWeek,
    };
  }

  /**
   * CronDTO를 크론 표현식으로 변환합니다.
   * @param {CronDTO} cron 크론 객체 (second, minute, hour, day, month, dayOfWeek)
   * @returns {string} 크론 표현식 (* * * * * *)
   */
  format(cron: CronDTO): string {
    return `${cron.second} ${cron.minute} ${cron.hour} ${cron.day} ${cron.month} ${cron.dayOfWeek}`;
  }
}
