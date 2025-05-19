import { EventAction, EventActionType } from '@libs/constants';
import {
  RewardRequestLogStatus,
  RewardRequestLogStatusType,
} from '@libs/constants/reward-log.constant';
import { CreateRewardRequestLogDto } from '@libs/dto/event/request/create-reward-request-log.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type RewardRequestLogDocument = HydratedDocument<RewardRequestLog>;

@Schema({ timestamps: true })
export class RewardRequestLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  event: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(EventAction),
  })
  action: EventActionType;

  @Prop({
    type: String,
    enum: Object.values(RewardRequestLogStatus),
    default: RewardRequestLogStatus.PENDING,
  })
  status: RewardRequestLogStatusType;

  @Prop()
  content?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  static createLog(dto: CreateRewardRequestLogDto): Partial<RewardRequestLog> {
    return {
      user: new Types.ObjectId(dto.user),
      event: new Types.ObjectId(dto.event),
      action: dto.action,
      status: dto.status,
      content: dto.content,
      metadata: dto.metadata,
    };
  }
}

export const RewardRequestLogSchema = SchemaFactory.createForClass(RewardRequestLog);
