export class RewardRequestSummaryDto {
  id: string;
  eventName?: string;
  rewards: string[];
  status: string;
  content?: string;
  createdAt?: Date;
}
