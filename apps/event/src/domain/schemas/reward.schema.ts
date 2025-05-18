import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type RewardDocument = HydratedDocument<Reward>;

@Schema({ timestamps: true })
export class Reward {
  // 이벤트 명
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  // 연결된 이벤트
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: false })
  event?: Types.ObjectId;

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
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
