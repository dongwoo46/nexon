import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
export class UpdateEventPayloadDto extends UpdateEventDto {
  id: string;
}
