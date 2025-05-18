// apps/auth/src/domain/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { RoleType } from '../types/role.type';
import * as bcrypt from 'bcrypt';
import { SignUpReqDto } from '@libs/dto';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // 유저 이메일(로그인용)
  @Prop({ required: true, unique: true })
  email: string;

  // 비밀번호
  @Prop({ required: true })
  password: string;

  // admin: 관리자 / operator: 운영자 / auditor: 감사자 / member: 일반 유저
  @Prop({ default: 'USER', type: String })
  role: RoleType;

  // 유저 상태 관리
  @Prop({ default: 'active' })
  status: 'active' | 'banned' | 'inactive';

  // 누적 출석 횟수 (기본 출석 이벤트)
  @Prop({ default: 0 })
  attendanceCount: number;

  // 연속 출석 횟수
  @Prop({ default: 0 })
  continuousAttendanceCount: number;

  // 마지막 출석 날짜 (연속 출석 판단)
  @Prop({ default: null })
  lastAttendanceDate: Date;

  // 현재 보유 포인트 (뽑기, 보상 구매)
  @Prop({ default: 0 })
  points: number;

  // 누적 사용 포인트 (랭킹/이벤트 판단용)
  @Prop({ default: 0 })
  usedPoints: number;

  // 총 로그인 횟수 (누적 로그인 이벤트, 통계)
  @Prop({ default: 0 })
  loginCount: number;

  // 마지막 로그인 일시 (출석 이벤트 중복 방지 )
  @Prop({ default: null })
  lastLoginAt: Date;

  // 받은 보상 ID 배열
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Reward',
    default: [],
  })
  receivedRewards: Types.ObjectId[];

  // 유저 별명
  @Prop({ default: null })
  nickname?: string;

  static async signUpUser(dto: SignUpReqDto): Promise<Partial<User>> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return {
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 'USER',
      status: 'active',
      attendanceCount: 0,
      continuousAttendanceCount: 0,
      lastAttendanceDate: undefined,
      points: 0,
      usedPoints: 0,
      loginCount: 0,
      lastLoginAt: undefined,
      receivedRewards: [],
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
