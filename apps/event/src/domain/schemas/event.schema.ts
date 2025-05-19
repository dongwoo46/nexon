import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Condition, ConditionType, EventStatus, EventStatusType, EventType } from '@libs/constants';
import { CreateEventDto } from '@libs/dto';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  // 이벤트 명
  @Prop({ required: true, unique: true })
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
  @Prop({ default: EventStatus.ACTIVE, type: String })
  status: EventStatusType;

  // 이벤트 보상 리스트
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Reward' }])
  rewards: Types.ObjectId[];

  // 이벤트 조건 리스트
  @Prop({
    type: [String],
    enum: Object.values(Condition),
    default: [],
  })
  conditions: ConditionType[];

  static createEvent(dto: CreateEventDto): Partial<Event> {
    return {
      name: dto.name,
      description: dto.description,
      type: dto.type,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
      status: dto.status ?? EventStatus.ACTIVE,
      rewards: dto.rewards.map((id) => new Types.ObjectId(id)),
      conditions: dto.conditions ?? [],
    };
  }
}

export const EventSchema = SchemaFactory.createForClass(Event);
