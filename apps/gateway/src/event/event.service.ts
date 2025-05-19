import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import {
  CreateItemDto,
  CreateRewardDto,
  EventDetailResponseDto,
  EventListResponseDto,
  ResponseDto,
} from '@libs/dto';
import { CreateEventDto } from '@libs/dto/event/request/create-event.dto';
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventGatewayService {
  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

  //아이템 생성
  async createItem(dto: CreateItemDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateItemDto>(EventMessagePatternConst.ITEM_CREATED, dto),
    );
  }

  // 보상 생성
  async createRewawrd(dto: CreateRewardDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateRewardDto>(
        EventMessagePatternConst.REWARD_CREATED,
        dto,
      ),
    );
  }

  // 이벤트 생성
  async createEvent(dto: CreateEventDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateEventDto>(
        EventMessagePatternConst.EVENT_CREATED,
        dto,
      ),
    );
  }

  // 이벤트 목록 조회
  async getEventList(filter: EventFilterDto): Promise<EventListResponseDto[]> {
    return await firstValueFrom(
      this.eventClient.send<EventListResponseDto[], EventFilterDto>(
        EventMessagePatternConst.EVENT_LIST,
        filter,
      ),
    );
  }

  //이벤트 상세 조회
  async getEventDetail(id: string): Promise<EventDetailResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<EventDetailResponseDto, string>(
        EventMessagePatternConst.EVENT_DETAIL,
        id,
      ),
    );
  }
}
