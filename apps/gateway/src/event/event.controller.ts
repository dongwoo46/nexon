import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { EventGatewayService } from './event.service';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateEventConditionReqDto, ResponseDto } from '@libs/dto';
import { Role } from '@libs/constants';

@Controller('event')
export class EventGatewayController {
  constructor(private readonly eventService: EventGatewayService) {}

  // 이벤트 조건 생성
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('v1/event-condition')
  async createEventCondition(@Body() dto: CreateEventConditionReqDto[]): Promise<ResponseDto> {
    return this.eventService.createEventCondition(dto);
  }
}
