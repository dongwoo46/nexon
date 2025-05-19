import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthMessagePatternConst } from '@libs/constants';
import { LoginReqDto, LoginResDto } from '@libs/dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthMessagePatternConst.USER_LOGIN)
  async handleSignup(@Payload() dto: LoginReqDto): Promise<LoginResDto> {
    try {
      return await this.authService.login(dto);
    } catch (err) {
      throw err;
    }
  }
}
