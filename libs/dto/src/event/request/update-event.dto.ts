import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
export class UpdateEventPayloadDto extends UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  id: string; //eventId
}
