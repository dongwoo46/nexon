import { Controller, Get } from '@nestjs/common';
import { EventService } from '../../application/event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import {
  CreateEventDto,
  EventDetailResponseDto,
  EventListResponseDto,
  ResponseDto,
} from '@libs/dto';
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 이벤트 생성
  @MessagePattern(EventMessagePatternConst.EVENT_CREATED)
  async createEvent(@Payload() dto: CreateEventDto): Promise<ResponseDto> {
    return await this.eventService.createEvent(dto);
  }

  // 이벤트 목록 조회
  @MessagePattern(EventMessagePatternConst.EVENT_LIST)
  async getEvents(@Payload() filter: EventFilterDto): Promise<EventListResponseDto[]> {
    return await this.eventService.getEvents(filter);
  }

  // 이벤트 상세 조회
  @MessagePattern(EventMessagePatternConst.EVENT_DETAIL)
  async getEventById(@Payload() id: string): Promise<EventDetailResponseDto> {
    return await this.eventService.getEventById(id);
  }
}
