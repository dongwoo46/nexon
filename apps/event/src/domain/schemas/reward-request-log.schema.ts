import { EventActionType } from '@libs/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type RewardRequestLogDocument = HydratedDocument<RewardRequestLog>;

@Schema({ timestamps: true })
export class RewardRequestLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  event: Types.ObjectId;

  @Prop({ type: String })
  action: EventActionType; // REQUEST_ATTEMPT, REQUEST_SUCCESS, REQUEST_FAILED 등

  @Prop()
  status: 'pending' | 'success' | 'failed';

  @Prop()
  reason?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const RewardRequestLogSchema = SchemaFactory.createForClass(RewardRequestLog);
