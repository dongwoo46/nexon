import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { CreateEventConditionReqDto, ResponseDto } from '@libs/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventGatewayService {
  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

  /**
   * @param dto 이벤트 조건 생성 dto 리스트
   * @returns
   */
  async createEventCondition(dto: CreateEventConditionReqDto[]): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateEventConditionReqDto[]>(
        EventMessagePatternConst.EVENT_CONDITION_CREATE,
        dto,
      ),
    );
  }
}
