import { Module } from '@nestjs/common';
import { EventService } from './application/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventController } from './interfaces/controllers/event.controller';
import { EventConditionService } from './application/event-condition.service';
import { ItemService } from './application/item.service';
import { RewardRequestService } from './application/reward-request.service';
import { RewardService } from './application/reward.service';
import { RewardRequestLogService } from './application/reward-request-log.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/maple', { dbName: 'maple', ssl: false }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    EventConditionService,
    RewardRequestLogService,
    ItemService,
    RewardRequestService,
    RewardService,
  ],
})
export class EventModule {}
