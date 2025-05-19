export const RewardRequestLogStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export type RewardRequestLogStatusType =
  (typeof RewardRequestLogStatus)[keyof typeof RewardRequestLogStatus];
