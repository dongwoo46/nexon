import { Controller, Get } from '@nestjs/common';
import { EventService } from '../../application/event.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import {
  ConditionEvaluationResultDto,
  CreateEventDto,
  EventDetailResponseDto,
  EventListResponseDto,
  ResponseDto,
  UpdateEventDto,
  UpdateEventPayloadDto,
} from '@libs/dto';
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';
import { ResponseIdDto } from '@libs/dto/event/response/response-id-dto.dto';
import { EvaluateEventConditionDto } from '@libs/dto/event/request/evaluate-event-condition.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 이벤트 생성
  @MessagePattern(EventMessagePatternConst.EVENT_CREATED)
  async createEvent(@Payload() dto: CreateEventDto): Promise<ResponseDto> {
    try {
      return await this.eventService.createEvent(dto);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  // 이벤트 목록 조회
  @MessagePattern(EventMessagePatternConst.EVENT_LIST)
  async getEvents(@Payload() filter: EventFilterDto): Promise<EventListResponseDto[]> {
    try {
      return await this.eventService.getEvents(filter);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  // 이벤트 상세 조회
  @MessagePattern(EventMessagePatternConst.EVENT_DETAIL)
  async getEventById(@Payload() id: string): Promise<EventDetailResponseDto> {
    try {
      return await this.eventService.getEventById(id);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  // 이벤트 수정
  @MessagePattern(EventMessagePatternConst.EVENT_UPDATED)
  async updateEvent(@Payload() payload: UpdateEventPayloadDto): Promise<ResponseIdDto> {
    try {
      const { id, ...dto } = payload;
      return this.eventService.updateEvent(id, dto);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  // 이벤트 조건 평가
  @MessagePattern(EventMessagePatternConst.EVENT_EVALUATE_CONDITIONS)
  async evaluateConditions(
    @Payload() dto: EvaluateEventConditionDto,
  ): Promise<ConditionEvaluationResultDto> {
    try {
      return this.eventService.evaluateEventCondition(dto);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
