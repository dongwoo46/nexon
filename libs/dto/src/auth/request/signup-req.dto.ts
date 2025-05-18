import { IsEmail, IsString, IsOptional, IsIn, MinLength, Matches } from 'class-validator';
import { RoleType } from '../../../../../apps/auth/src/domain/types/role.type';

export class SignUpReqDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  @Matches(
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]{10,}$/,
    {
      message: '비밀번호는 최소 10자, 하나 이상의 대문자, 하나 이상의 특수문자를 포함해야 합니다.',
    },
  )
  password: string;

  @IsString()
  confirmPassword: string;

  @IsOptional()
  @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
  role?: RoleType;
}
