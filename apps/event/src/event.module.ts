import { Module } from '@nestjs/common';
import { EventService } from './application/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventController } from './interfaces/controllers/event.controller';
import { ItemService } from './application/item.service';
import { RewardRequestService } from './application/reward-request.service';
import { RewardService } from './application/reward.service';
import { Item, ItemSchema } from './domain/schemas/item.schema';
import { Reward, RewardSchema } from './domain/schemas/reward.schema';
import { ItemController } from './interfaces/controllers/item.controller';
import { RewardRequestController } from './interfaces/controllers/reward-request.controller';
import { RewardController } from './interfaces/controllers/reward.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { Event, EventSchema } from './domain/schemas/event.schema';
import { RewardRequest, RewardRequestSchema } from './domain/schemas/reward-request.schema';
import { AuthModule } from 'apps/auth/src/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/maple?replicaSet=rs0', {
      dbName: 'maple',
      ssl: false,
    }),
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Event.name, schema: EventSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [EventController, ItemController, RewardRequestController, RewardController],
  providers: [EventService, ItemService, RewardRequestService, RewardService],
})
export class EventModule {}
