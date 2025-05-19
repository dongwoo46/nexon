import { Controller, Post, Body, Get, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { EventGatewayService } from './event.service';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  CreateEventDto,
  CreateItemDto,
  CreateRewardDto,
  EventsResponseDto,
  ResponseDto,
} from '@libs/dto';
import { Role } from '@libs/constants';
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';

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

  // 이벤트 리스트 조회
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('event/v1')
  async getEvents(@Body() dto: EventFilterDto): Promise<EventsResponseDto> {
    const data = await this.eventService.getEventList(dto);
    return {
      statusCode: HttpStatus.OK,
      message: '이벤트 리스트 조회 성공',
      data,
    };
  }

  // 이벤트 상세 조회
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('event/v1')
  async getEventDetail(@Body() dto: CreateEventDto): Promise<ResponseDto> {
    return this.eventService.createEvent(dto);
  }
}
