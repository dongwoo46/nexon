import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { EventType } from '../types/event.type';
import { EventStatus } from '../types/event-status.type';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  // 이벤트 명
  @Prop({ required: true })
  name: string;

  // 이벤트 설명
  @Prop()
  description?: string;

  // 이벤트 유형/타입
  @Prop({ required: true, type: String })
  type: EventType;

  // 이벤트 시작시간
  @Prop({ type: Date, required: true })
  startAt: Date;

  // 이벤트 종료 시간
  @Prop({ type: Date, required: true })
  endAt: Date;

  // 이벤트 상태
  @Prop({ default: 'active', type: String })
  status: EventStatus;

  // 이벤트 보상 리스트
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Reward' }])
  rewards: Types.ObjectId[];

  // 이벤트 조건 리스트
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'EventCondition' }])
  conditions?: Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
