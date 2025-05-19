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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/maple', { dbName: 'maple', ssl: false }),
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: Item.name, schema: ItemSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    RewardRequestLogService,
    ItemService,
    RewardRequestService,
    RewardService,
  ],
})
export class EventModule {}
