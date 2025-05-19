import { RewardRequestStatus, RewardRequestStatusType } from '@libs/constants';
import { CreateRewardRequestDto } from '@libs/dto/event/request/create-reward-request.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type RewardRequestDocument = HydratedDocument<RewardRequest>;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // 유저

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId; // 이벤트

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Reward' }])
  rewards: Types.ObjectId[]; // 보상

  @Prop({
    type: String,
    enum: Object.values(RewardRequestStatus),
    default: RewardRequestStatus.PENDING,
  })
  status: RewardRequestStatusType; // 보상 상태

  @Prop()
  content?: string; // 감사로그

  createdAt?: Date;
  updatedAt?: Date;

  static createRewardRequest(dto: CreateRewardRequestDto): Partial<RewardRequest> {
    return {
      user: new Types.ObjectId(dto.user),
      event: new Types.ObjectId(dto.event),
      rewards: dto.rewards.map((r) => new Types.ObjectId(r)),
      content: dto.content,
      status: dto.status ?? 'pending',
    };
  }
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
// 유저는 이벤트에 단 하나의 요청만 가능 중복 요청 불가
RewardRequestSchema.index({ user: 1, event: 1 }, { unique: true });
