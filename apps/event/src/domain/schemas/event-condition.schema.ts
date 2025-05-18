import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ConditionType } from '../../../../../libs/constants/condition.constant';
import { ConditionOperatorType } from '../../../../../libs/constants/condtion-operator.constant';
import { CreateEventConditionReqDto } from '@libs/dto';

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
  @Prop({ type: MongooseSchema.Types.Mixed, required: true }) //명시적 타입 지정
  value: string | number;

  // 조건에 대상이 필요한 경우
  @Prop()
  itemKey?: string;

  // 운영자 분류/태그
  @Prop()
  category?: string;

  // 설명
  @Prop()
  description?: string;

  static createEventCondition(dto: CreateEventConditionReqDto): Partial<EventCondition> {
    return {
      type: dto.type,
      operator: dto.operator,
      value: dto.value,
      itemKey: dto.itemKey,
      category: dto.category,
      description: dto.description,
    };
  }
}

export const EventConditionSchema = SchemaFactory.createForClass(EventCondition);
