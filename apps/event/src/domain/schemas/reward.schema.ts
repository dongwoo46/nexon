import { EventConst, EventType } from '@libs/constants';
import { CreateRewardDto } from '@libs/dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type RewardDocument = HydratedDocument<Reward>;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true, unique: true })
  name: string;

  // 중복가능 - 이벤트 생성 시 rewardKey로 이벤트에 따른 보상 찾기
  @Prop({
    required: true,
    enum: Object.values(EventConst),
  })
  rewardKey: EventType;

  @Prop()
  description?: string;

  // 연결된 이벤트
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: false })
  event: Types.ObjectId;

  @Prop({
    type: [
      {
        item: { type: MongooseSchema.Types.ObjectId, ref: 'Item', required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    default: [],
  })
  items: { item: Types.ObjectId; quantity: number }[];

  static createReward(dto: CreateRewardDto): Partial<Reward> {
    return {
      name: dto.name,
      description: dto.description,
      event: dto.event ? new Types.ObjectId(dto.event) : undefined,
      rewardKey: dto.rewardKey,
      items: (dto.items ?? []).map((i) => ({
        item: new Types.ObjectId(i.item),
        quantity: i.quantity,
      })),
    };
  }
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
