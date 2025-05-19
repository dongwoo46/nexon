import { IsMongoId } from 'class-validator';

export class EvaluateEventConditionDto {
  @IsMongoId()
  eventId: string;

  @IsMongoId()
  userId: string;
}
