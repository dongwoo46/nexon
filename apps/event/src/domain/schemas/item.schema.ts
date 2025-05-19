import {
  EventConst,
  EventType,
  ItemConst,
  ItemGrade,
  ItemGradeType,
  ItemType,
} from '@libs/constants';
import { AcquireLimit, AcquireLimitType } from '@libs/constants/acquire-limit.constant';
import { CreateItemDto } from '@libs/dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(EventConst),
  })
  itemKey: EventType;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;

  // 아이템의 종류 (쿠폰, 스킨 등)
  @Prop({
    required: true,
    type: String,
    enum: Object.values(ItemConst),
  })
  type: ItemType;

  // 아이템 효과 (예: 10% 할인)
  @Prop()
  effect?: string;

  // 사용 가능 여부
  @Prop()
  usable?: boolean;

  // 유효기간
  @Prop()
  expiresAt?: Date;

  // 아이템 등급
  @Prop({
    required: true,
    type: String,
    enum: Object.values(ItemGrade),
  })
  grade: ItemGradeType;

  static createItem(dto: CreateItemDto): Partial<Item> {
    return {
      itemKey: dto.itemKey,
      name: dto.name,
      type: dto.type,
      grade: dto.grade,
      usable: dto.usable,
      description: dto.description,
      imageUrl: dto.imageUrl,
      effect: dto.effect,
      expiresAt: dto.expiresAt,
    };
  }
}

export const ItemSchema = SchemaFactory.createForClass(Item);
