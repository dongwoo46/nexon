import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginReqDto, LoginResDto, SignUpReqDto, SignUpResDto } from '@libs/dto';
import { firstValueFrom } from 'rxjs';
import { UserMessagePatternConst } from '@libs/constants';

@Injectable()
export class EventGatewayService {
  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}
}
