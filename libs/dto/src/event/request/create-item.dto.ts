import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
  IsDefined,
  IsIn,
  IsEnum,
  IsDateString,
} from 'class-validator';
import {
  ItemType,
  ItemGradeType,
  ItemConst,
  ItemGrade,
  EventConst,
  EventType,
} from '@libs/constants';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @IsNotEmpty()
  @IsEnum(EventConst)
  itemKey: EventType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ItemConst)
  type: ItemType;

  @IsNotEmpty()
  @IsEnum(ItemGrade)
  grade: ItemGradeType;

  @IsBoolean()
  @IsDefined()
  usable: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  effect?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;
}
