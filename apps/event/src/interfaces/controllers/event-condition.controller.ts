import { Controller, Get } from '@nestjs/common';
import { EventConditionService } from '../../application/event-condition.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { CreateEventConditionReqDto, ResponseDto } from '@libs/dto';

@Controller()
export class EventConditionController {
  constructor(private readonly eventConditionService: EventConditionService) {}

  @MessagePattern(EventMessagePatternConst.EVENT_CONDITION_CREATE)
  async createEventCondition(@Payload() dto: CreateEventConditionReqDto[]): Promise<ResponseDto> {
    return await this.eventConditionService.createEventConditions(dto);
  }
}
