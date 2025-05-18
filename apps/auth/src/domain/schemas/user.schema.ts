import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignUpReqDto } from '@libs/dto';
import { RoleType } from '@libs/constants/role.constant';
import { UserStatusType } from '@libs/constants/user-status.constant';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  // 유저 이메일(로그인용)
  @Prop({ required: true, unique: true })
  email: string;

  // 비밀번호
  @Prop({ required: true })
  password: string;

  // admin: 관리자 / operator: 운영자 / auditor: 감사자 / user: 일반 유저
  @Prop({ default: 'USER', type: String })
  role: RoleType;

  // 유저 상태 관리
  @Prop({ default: 'active', type: String })
  status: UserStatusType;

  // 출석 날짜
  @Prop({ type: [String], default: [] }) // 형식: YYYY-MM-DD
  attendanceDates: string[];

  // 연속 출석 횟수
  @Prop({ default: 0 })
  continuousAttendanceCount: number;

  // 현재 보유 포인트 (뽑기, 보상 구매)
  @Prop({ default: 0 })
  points: number;

  // 누적 사용 포인트 (랭킹/이벤트 판단용)
  @Prop({ default: 0 })
  usedPoints: number;

  // 초대 친구 수
  @Prop({ default: 0 })
  inviteCount: number;

  // 초대한 친구
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  invitedBy?: Types.ObjectId;

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
      attendanceDates: undefined,
      continuousAttendanceCount: 0,
      points: 0,
      usedPoints: 0,
      receivedRewards: [],
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
