import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventScheduleService {
  private readonly logger = new Logger(EventScheduleService.name);

  //   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  //   async handleDailyEventCreation() {
  //   }
}
