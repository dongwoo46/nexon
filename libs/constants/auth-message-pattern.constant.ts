export const AuthMessagePatternConst = {
  USER_SIGNUP: 'user.signup',
  USER_LOGIN: 'user.login',
} as const;

export type AuthMessagePattern =
  (typeof AuthMessagePatternConst)[keyof typeof AuthMessagePatternConst];
