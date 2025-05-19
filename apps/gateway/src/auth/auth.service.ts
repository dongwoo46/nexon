import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginReqDto, LoginResDto, SignUpReqDto, SignUpResDto } from '@libs/dto';
import { firstValueFrom } from 'rxjs';
import { AuthMessagePatternConst } from '@libs/constants';

@Injectable()
export class AuthGatewayService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  async signup(dto: SignUpReqDto): Promise<SignUpResDto> {
    try {
      return await firstValueFrom(
        this.authClient.send<SignUpResDto, SignUpReqDto>(AuthMessagePatternConst.USER_SIGNUP, dto),
      );
    } catch (err) {
      throw err;
    }
  }

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    return await firstValueFrom(
      this.authClient.send<LoginResDto, LoginReqDto>(AuthMessagePatternConst.USER_LOGIN, dto),
    );
  }
}
