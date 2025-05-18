import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { EventGatewayService } from './event.service';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateEventConditionReqDto, CreateItemDto, ResponseDto } from '@libs/dto';
import { Role } from '@libs/constants';

@Controller()
export class EventGatewayController {
  constructor(private readonly eventService: EventGatewayService) {}

  // 이벤트 조건 생성
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('event-condition/v1')
  async createEventCondition(@Body() dto: CreateEventConditionReqDto[]): Promise<ResponseDto> {
    return this.eventService.createEventCondition(dto);
  }

  // 아이템 생성
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('item/v1')
  async createItem(@Body() dto: CreateItemDto): Promise<ResponseDto> {
    return this.eventService.createItem(dto);
  }
}
