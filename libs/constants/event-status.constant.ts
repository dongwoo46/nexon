export const EventStatus = {
  ACTIVE: 'ACTIVE', // 활성화 이벤트
  INACTIVE: 'INACTIVE', // 비활성화 이벤트
  CLOSED: 'CLOSED', // 종료된 이벤트
} as const;

export type EventStatusType = (typeof EventStatus)[keyof typeof EventStatus];
