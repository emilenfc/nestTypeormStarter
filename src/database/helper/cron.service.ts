import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor() {}
  // TODO: this service is where I will run all my tasks of cron Jobs

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleEvery10SecondsForTesting() {
    console.log('Task executed every 10 seconds');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleEveryHourForTesting() {
    console.log('Task executed every hour');
  }
}
