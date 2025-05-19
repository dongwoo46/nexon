import { Module } from '@nestjs/common';
import { EventService } from './application/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventController } from './interfaces/controllers/event.controller';
import { ItemService } from './application/item.service';
import { RewardRequestService } from './application/reward-request.service';
import { RewardService } from './application/reward.service';
import { RewardRequestLogService } from './application/reward-request-log.service';
import { Item, ItemSchema } from './domain/schemas/item.schema';
import { Reward, RewardSchema } from './domain/schemas/reward.schema';
import { ItemController } from './interfaces/controllers/item.controller';
import { RewardRequestController } from './interfaces/controllers/reward-request.controller';
import { RewardController } from './interfaces/controllers/reward.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { EventScheduleService } from './application/event-schedule.service';
import { Event, EventSchema } from './domain/schemas/event.schema';
import { RewardRequest, RewardRequestSchema } from './domain/schemas/reward-request.schema';
import {
  RewardRequestLog,
  RewardRequestLogSchema,
} from './domain/schemas/reward-request-log.schema';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://mongodb:27017/maple', { dbName: 'maple', ssl: false }),
    MongooseModule.forRoot('mongodb://localhost:27017/maple', { dbName: 'maple', ssl: false }),
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Event.name, schema: EventSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: RewardRequestLog.name, schema: RewardRequestLogSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [EventController, ItemController, RewardRequestController, RewardController],
  providers: [
    EventService,
    RewardRequestLogService,
    ItemService,
    RewardRequestService,
    RewardService,
    EventScheduleService,
  ],
})
export class EventModule {}
