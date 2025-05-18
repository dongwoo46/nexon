export const EventAction = {
  REQUEST_ATTEMPT: 'REQUEST_ATTEMPT', // 요청 시도
  REQUEST_SUCCESS: 'REQUEST_SUCCESS', // 요청 성공 -> 보상 획득
  REQUEST_FAILED: 'REQUEST_FAILED', // 요청 실패 -> 보상 실패
  CONDITION_EVALUATED: 'CONDITION_EVALUATED', // 조건 평가
} as const;

export type EventActionType = (typeof EventAction)[keyof typeof EventAction];
