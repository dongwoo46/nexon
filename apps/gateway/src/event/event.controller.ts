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
  Logger,
} from '@nestjs/common';
import { EventGatewayService } from './event.service';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  ConditionEvaluationResultDto,
  CreateEventDto,
  CreateItemDto,
  CreateRewardDto,
  CreateRewardRequestDto,
  EventDetailResponseDto,
  EventsResponseDto,
  ResponseDto,
  UpdateEventDto,
  UpdateEventPayloadDto,
  UpdateRewardRequestDto,
  UpdateRewardRequestPayloadDto,
} from '@libs/dto';
import { Role } from '@libs/constants';
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RewardRequestFilterDto } from '@libs/dto/event/request/reward-request-filter.dto';
import { ResponseIdDto } from '@libs/dto/event/response/response-id-dto.dto';
import Info from './../../../../node_modules/luxon/src/info';

export interface UserPayload {
  userId: string; // MongoDB ObjectId 문자열
  email: string;
  role: 'USER' | 'ADMIN' | 'OPERATOR' | 'AUDITOR';
}

@Controller()
export class EventGatewayController {
  private readonly logger = new Logger(EventGatewayController.name);

  constructor(private readonly eventService: EventGatewayService) {}

  // 아이템 생성
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('item/v1')
  async createItem(@Body() dto: CreateItemDto): Promise<ResponseDto> {
    this.logger.log('아이템생성');
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

  // 보상 요청 생성
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post('reward-reuqest/v1')
  async createRewardRequest(@Body() dto: CreateRewardRequestDto): Promise<ResponseDto> {
    return this.eventService.createRewardRequest(dto);
  }

  // 이벤트 리스트 조회
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('event/v1')
  async getEvents(@Query() dto: EventFilterDto): Promise<EventsResponseDto> {
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
  @Get('event/v1/:id')
  async getEventDetail(@Param('id') id: string): Promise<EventDetailResponseDto> {
    return this.eventService.getEventDetail(id);
  }

  // 유저 본인 보상 요청 이력 조회
  @Get('reward-request/v1/me')
  async getMyRewardRequests(@CurrentUser() user: UserPayload) {
    this.logger.log(user);
    return await this.eventService.getMyRewardRequests(user.userId);
  }

  // 보상요청 상세 조회
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  @Get('reward-request/v1/:id')
  async getDetail(@Param('id') id: string) {
    this.logger.log('보상요청 상세조회');
    return await this.eventService.getRewardRequestDetail(id);
  }

  // 관리자 전체 보상 요청 이력 조회
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  @Get('reward-request/v1')
  async getAllRequests(@Query() query: RewardRequestFilterDto) {
    return await this.eventService.getAllRewardRequests(query);
  }

  // 이벤트 정보 수정
  @Patch('event/v1/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto): Promise<ResponseIdDto> {
    const payload: UpdateEventPayloadDto = { id, ...dto };
    return this.eventService.updateEvent(payload);
  }

  // 보상요청 수정
  @Patch('reward-request/v1/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  async updateRewardRequestWithEvaluateConditions(
    @Param('id') id: string,
    @Body() dto: UpdateRewardRequestDto,
  ): Promise<ResponseIdDto> {
    const payload: UpdateRewardRequestPayloadDto = { id, ...dto };
    this.logger.log(payload);
    return this.eventService.updateRewardRequestWithEvaluateConditions(payload);
  }

  // 이벤트 조건 검증
  @Get(':eventId/evaluate')
  async evaluateConditions(
    @Param('eventId') eventId: string,
    @CurrentUser() user: UserPayload,
  ): Promise<ConditionEvaluationResultDto> {
    const userId = user.userId; // 👈 바로 여기서 꺼내면 됩니다
    return this.eventService.evaluateEventCondition({ userId, eventId });
  }
}
