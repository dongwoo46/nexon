import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { EventGatewayService } from './event.service';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  CreateEventDto,
  CreateItemDto,
  CreateRewardDto,
  EventsResponseDto,
  ResponseDto,
  UpdateEventDto,
  UpdateEventPayloadDto,
} from '@libs/dto';
import { Role } from '@libs/constants';
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RewardRequestFilterDto } from '@libs/dto/event/request/reward-request-filter.dto';
import { ResponseIdDto } from '@libs/dto/event/response/response-id-dto.dto';

export interface UserPayload {
  _id: string; // MongoDB ObjectId 문자열
  email: string;
  role: 'USER' | 'ADMIN' | 'OPERATOR' | 'AUDITOR';
}

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

  // 유저 본인 보상 요청 이력 조회
  @Get('reward-request/v1/me')
  async getMyRequests(@CurrentUser() user: UserPayload) {
    return await this.eventService.getMyRewardRequests(user._id);
  }

  // 관리자 전체 요청 이력 조회
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  @Get('reward-request/v1')
  async getAllRequests(@Query() query: RewardRequestFilterDto) {
    return await this.eventService.getAllRewardRequests(query);
  }

  // 상세 조회
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  @Get('reward-request/v1/:id')
  async getDetail(@Param('id') id: string) {
    return await this.eventService.getRewardRequestDetail(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto): Promise<ResponseIdDto> {
    const payload: UpdateEventPayloadDto = { id, ...dto };
    return this.eventService.updateEvent(payload);
  }
}
