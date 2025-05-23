import { NestFactory } from '@nestjs/core';
import { EventModule } from './event.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

if (!globalThis.crypto) {
  globalThis.crypto = require('crypto');
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EventModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3002,
    },
  });

  await app.listen();
}
bootstrap();
