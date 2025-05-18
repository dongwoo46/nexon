import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ConditionType } from '../types/condition.type';
import { ConditionOperatorType } from '../types/condtion-operator.type';

export type EventConditionDocument = HydratedDocument<EventCondition>;

@Schema({ timestamps: true })
export class EventCondition {
  // 조건의 타입 (출석, 포인트, 로그인)
  @Prop({ required: true, type: String })
  type: ConditionType;

  // 비교 연산자 (equals, greaterThanOrEqual)
  @Prop({ required: true, type: String })
  operator: ConditionOperatorType;

  // 비교값
  @Prop({ required: true })
  value: number | string;

  // 조건에 대상이 필요한 경우
  @Prop()
  itemKey?: string;

  // 운영자 분류/태그
  @Prop()
  category?: string;

  // 설명
  @Prop()
  description?: string;
}

export const EventConditionSchema = SchemaFactory.createForClass(EventCondition);
