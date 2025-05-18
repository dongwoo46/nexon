export type EventActionType =
  | 'REQUEST_ATTEMPT' // 요청 시도
  | 'REQUEST_SUCCESS' // 요청 성공 -> 보상 획득
  | 'REQUEST_FAILED' // 요청 실패 -> 보상 실패
  | 'CONDITION_EVALUATED'; // 조건 평가
