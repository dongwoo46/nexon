import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthGatewayModule } from './auth/auth.module';

@Module({
  imports: [AuthGatewayModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
