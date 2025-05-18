import { RewardStatusType } from '@libs/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type RewardRequestDocument = HydratedDocument<RewardRequest>;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // 유저

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId; // 이벤트

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reward', required: true })
  reward: Types.ObjectId; // 보상

  @Prop({ default: 'pending', type: String })
  status: RewardStatusType; // 보상 요청 상태

  @Prop()
  content?: string; // 감사로그
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
