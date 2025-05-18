export const UserMessagePatternConst = {
  USER_SIGNUP: 'user.signup',
  USER_LOGIN: 'user.login',
} as const;

export type UserMessagePattern =
  (typeof UserMessagePatternConst)[keyof typeof UserMessagePatternConst];
