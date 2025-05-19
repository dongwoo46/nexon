import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { EventGatewayService } from './event.service';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateEventDto, CreateItemDto, CreateRewardDto, ResponseDto } from '@libs/dto';
import { Role } from '@libs/constants';

@Controller()
export class EventGatewayController {
  constructor(private readonly eventService: EventGatewayService) {}

  // 아이템 생성
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('item/v1')
  async createItem(@Body() dto: CreateItemDto): Promise<ResponseDto> {
    return this.eventService.createItem(dto);
  }

  // 보상 생성
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('reward/v1')
  async createReward(@Body() dto: CreateRewardDto): Promise<ResponseDto> {
    return this.eventService.createRewawrd(dto);
  }

  // 이벤트 생성
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('event/v1')
  async createEvent(@Body() dto: CreateEventDto): Promise<ResponseDto> {
    return this.eventService.createEvent(dto);
  }
}
