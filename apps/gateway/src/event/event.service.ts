import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { CreateItemDto, CreateRewardDto, ResponseDto } from '@libs/dto';
import { CreateEventDto } from '@libs/dto/event/request/create-event.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventGatewayService {
  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

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

  /**
   * 보상 생성
   * @param dto
   * @returns
   */
  async createRewawrd(dto: CreateRewardDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateRewardDto>(
        EventMessagePatternConst.REWARD_CREATED,
        dto,
      ),
    );
  }

  /**
   * 이벤트 생성
   * @param dto
   * @returns
   */
  async createEvent(dto: CreateEventDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateEventDto>(
        EventMessagePatternConst.EVENT_CREATED,
        dto,
      ),
    );
  }
}
