import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // api 프리픽스 추가
  app.setGlobalPrefix('api');

  await app.listen(3000);
  Logger.log('Gateway is running on');
}
bootstrap();
