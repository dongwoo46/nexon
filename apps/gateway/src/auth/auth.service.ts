import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginReqDto, LoginResDto, SignUpReqDto, SignUpResDto } from '@libs/dto';
import { firstValueFrom } from 'rxjs';
import { UserMessagePatternConst } from '@libs/constants';

@Injectable()
export class AuthGatewayService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  async signup(dto: SignUpReqDto): Promise<SignUpResDto> {
    try {
      return await firstValueFrom(
        this.authClient.send<SignUpResDto, SignUpReqDto>(UserMessagePatternConst.USER_SIGNUP, dto),
      );
    } catch (err) {
      throw err;
    }
  }

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    return await firstValueFrom(
      this.authClient.send<LoginResDto, LoginReqDto>(UserMessagePatternConst.USER_LOGIN, dto),
    );
  }
}
