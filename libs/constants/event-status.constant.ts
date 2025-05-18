export const EventStatus = {
  ACTIVE: 'active', // 활성화 이벤트
  INACTIVE: 'inactive', // 비활성화 이벤트
  CLOSED: 'closed', // 종료된 이벤트
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];
