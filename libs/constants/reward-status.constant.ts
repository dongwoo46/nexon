export const RewardStatus = {
  RECEIVED: 'received',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const;

export type RewardStatusType = (typeof RewardStatus)[keyof typeof RewardStatus];
