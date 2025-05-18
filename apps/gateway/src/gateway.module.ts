import { Module, ValidationPipe } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthGatewayModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './auth/passport/roles.guard';

@Module({
  imports: [
    AuthGatewayModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      //app모듈에 글로벌 파이프 적용,
      provide: APP_PIPE,
      // app 모듈 인스턴스르 만들때마다 애플리케이션에 들어오는 모든 요청을 이 클래스의 인스턴스를 이용해 처리
      useValue: new ValidationPipe({
        whitelist: false,
        transform: false, // dto에 정의된 필드 유형이 일치하지 않으면 자동으로 타입변환 수행
        transformOptions: {
          enableImplicitConversion: false, // 문자열에서 숫자 불리언 또는 배열로 암시적변환
        },
      }),
    },
  ],
})
export class GatewayModule {}
