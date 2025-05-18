export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  OPERATOR: 'OPERATOR',
  AUDITOR: 'AUDITOR',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
