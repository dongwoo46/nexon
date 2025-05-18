import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { CreateEventConditionReqDto, CreateItemDto, ResponseDto } from '@libs/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventGatewayService {
  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

  /**
   * 이벤트 조건 생성
   * @param dto 이벤트 조건 생성 dto
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

  /**
   * 아이템 생성
   * @param dto 아이템 생성 dto
   * @returns
   */
  async createItem(dto: CreateItemDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateItemDto>(EventMessagePatternConst.ITEM_CREATED, dto),
    );
  }
}
