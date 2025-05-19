import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGatewayService } from './auth.service';
import { LoginReqDto, LoginResDto, SignUpReqDto, SignUpResDto } from '@libs/dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly authService: AuthGatewayService) {}

  @Public()
  @Post('v1/signup')
  async signup(@Body() dto: SignUpReqDto): Promise<SignUpResDto> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('v1/login')
  async login(@Body() dto: LoginReqDto): Promise<LoginResDto> {
    return this.authService.login(dto);
  }
}
