import { Module } from '@nestjs/common';
import { EventService } from './application/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventController } from './interfaces/controllers/event.controller';

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
