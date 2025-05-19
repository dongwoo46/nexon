import { EventType, EventStatusType } from '@libs/constants';

export class EventListResponseDto {
  id: string;
  name: string;
  type: EventType;
  status: EventStatusType;
  startAt: Date;
  endAt: Date;
}

export class EventsResponseDto {
  statusCode: number;
  message: string;
  data: EventListResponseDto[];
}
