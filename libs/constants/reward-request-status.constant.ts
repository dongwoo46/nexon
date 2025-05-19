export const RewardRequestStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REJECTED: 'REJECTED', // 운영자가 거절한 경우
} as const;

export type RewardRequestStatusType =
  (typeof RewardRequestStatus)[keyof typeof RewardRequestStatus];
