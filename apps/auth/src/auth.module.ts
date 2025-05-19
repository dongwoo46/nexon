import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { AuthController } from './interfaces/controllers/auth.controller';
import { User, UserSchema } from './domain/schemas/user.schema';
import { UserController } from './interfaces/controllers/user.controller';
import { UserService } from './application/user.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://mongodb:27017/maple?replicaSet=rs0',
      // 'mongodb://localhost:27017/maple',
      { dbName: 'maple', ssl: false },
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
  exports: [UserService],
})
export class AuthModule {}
