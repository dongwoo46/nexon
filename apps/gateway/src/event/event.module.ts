// apps/gateway/src/auth/auth.module.ts

import { Module, ValidationPipe } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventGatewayService } from './event.service';
import { EventGatewayController } from './event.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'event',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [EventGatewayController],
  providers: [EventGatewayService],
})
export class EventGatewayModule {}
