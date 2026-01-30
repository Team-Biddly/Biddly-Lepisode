import { CronDTO } from "./cron.dto";

export class JobDTO {
  id: string;
  cron: CronDTO;
  callback: () => void | Promise<void>;
}
