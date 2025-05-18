// apps/event/src/domain/schemas/event-log.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type EventLogDocument = EventLog & Document;

@Schema({ timestamps: true })
export class EventLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  event: Types.ObjectId;

  @Prop()
  action: 'CLAIM_ATTEMPT' | 'CLAIM_SUCCESS' | 'CLAIM_FAILED' | 'CONDITION_EVALUATED';

  @Prop()
  status: 'success' | 'failed';

  @Prop()
  reason?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const EventLogSchema = SchemaFactory.createForClass(EventLog);
