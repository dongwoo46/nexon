export const UserStatus = {
  ACTIVE: 'active',
  BANNED: 'banned',
  INACTIVE: 'inactive',
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
