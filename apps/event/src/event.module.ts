import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/maple', { dbName: 'maple', ssl: false }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
