import { EventType, EventStatusType, ConditionType } from '@libs/constants';

export class RewardSummaryDto {
  id: string;
  name: string;
  description?: string;
  items: {
    item: string;
    quantity: number;
  }[];
}

export class EventDetailResponseDto {
  id: string;
  name: string;
  description?: string;
  type: EventType;
  status: EventStatusType;
  startAt: Date;
  endAt: Date;
  rewards: RewardSummaryDto[];
  conditions: ConditionType[];
}
