export const Condition = {
  // 출석 관련
  ATTENDANCE_DAYS_7: 'ATTENDANCE_DAYS_7', // 출석 누적 7
  ATTENDANCE_DAYS_30: 'ATTENDANCE_DAYS_30', // 출석 누적 30
  CONSECUTIVE_DAYS_7: 'CONSECUTIVE_DAYS_7', // 연속 출적 7
  CONSECUTIVE_DAYS_14: 'CONSECUTIVE_DAYS_14', // 연속 출석 14
  DAILY_ATTENDANCE: 'DAILY_ATTENDANCE', // 일일 접속

  // 포인트 사용
  USED_POINTS_OVER_500: 'USED_POINTS_OVER_500', // 500포인트 사용시 보상

  // 친구 초대
  FRIEND_INVITE_OVER_10: 'FRIEND_INVITE_EVERY_10', // 친구 초대 10명 reward 수여
  FRIEND_INVITE_OVER_30: 'FRIEND_INVITE_EVERY_30', // 친구 초대 10명 reward 수여

  // 리워드 획득
  REWARD_COUNT_OVER_10: 'REWARD_COUNT_OVER_10', // 보상획득이 10개 넘으면 추가 보상
  REWARD_LEGENDARY_ACQUIRED: 'REWARD_LEGENDARY_ACQUIRED', // 레전드 보상 획득 시 추가 보상
} as const;

export type ConditionType = (typeof Condition)[keyof typeof Condition];
