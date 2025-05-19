import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  MinLength,
  Matches,
  ValidateIf,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { RoleType } from '../../../../constants/role.constant';

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

  @IsNotEmpty()
  @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'])
  role: RoleType;

  @ValidateIf((o) => ['ADMIN', 'AUDITOR', 'OPERATOR'].includes(o.role))
  @IsString()
  @IsNotEmpty({ message: '고급 권한 등록을 위해 비밀키가 필요합니다.' })
  secretKey?: string;

  // 초대자 ID
  @IsOptional()
  @IsMongoId()
  inviteCode?: string;
}
