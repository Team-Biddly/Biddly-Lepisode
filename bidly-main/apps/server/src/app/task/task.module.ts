import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CronService } from "../cron/cron.service";
import { TaskController } from "./task.controller";

@Module({
  providers: [TaskService, CronService],
  controllers: [TaskController],
})
export class TaskModule {}
