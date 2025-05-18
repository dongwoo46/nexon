import { Controller, Post, Body } from '@nestjs/common';
import { AuthGatewayService } from './auth.service';
import { SignUpReqDto, SignUpResDto } from '@libs/dto';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly authService: AuthGatewayService) {}

  @Post('v1/signup')
  async signup(@Body() dto: SignUpReqDto): Promise<SignUpResDto> {
    return this.authService.signup(dto);
  }
}
