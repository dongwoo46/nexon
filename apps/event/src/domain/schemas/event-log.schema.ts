import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { EventActionType } from '../types/event-action.type';

export type EventLogDocument = HydratedDocument<EventLog>;

@Schema({ timestamps: true })
export class EventLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  event: Types.ObjectId;

  @Prop({ type: String })
  action: EventActionType;

  @Prop()
  status: 'success' | 'failed';

  @Prop()
  reason?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const EventLogSchema = SchemaFactory.createForClass(EventLog);
