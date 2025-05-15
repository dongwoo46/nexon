import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  // api 프리픽스 추가
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
