import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConditionEvaluationResultDto,
  CreateEventDto,
  EventDetailResponseDto,
  EventListResponseDto,
  ResponseDto,
  UpdateEventDto,
} from '@libs/dto';
import { Event as EventSchema, EventDocument } from '../domain/schemas/event.schema'; // ✅ 이름 충돌 방지
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';
import { RpcException } from '@nestjs/microservices';
import * as dayjs from 'dayjs';
import { ResponseIdDto } from '@libs/dto/event/response/response-id-dto.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Condition, ConditionType, EventConst, EventStatus } from '@libs/constants';
import { RewardService } from './reward.service';
import { UserDocument } from 'apps/auth/src/domain/schemas/user.schema';
import { EvaluateEventConditionDto } from '@libs/dto/event/request/evaluate-event-condition.dto';
import { UserService } from 'apps/auth/src/application/user.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectModel(EventSchema.name)
    private readonly eventModel: Model<EventDocument>,
    private readonly rewardService: RewardService,
    private readonly userService: UserService,
  ) {}

  async createEvent(rawDto: CreateEventDto): Promise<ResponseDto> {
    const dto = plainToInstance(CreateEventDto, rawDto);
    await validateOrReject(dto);

    const now = dayjs();
    const startAt = dayjs(dto.startAt);
    const endAt = dayjs(dto.endAt);

    if (!startAt.isAfter(now)) {
      throw new BadRequestException('시작 시간은 현재 시간보다 이후여야 합니다.');
    }

    if (!endAt.isAfter(startAt)) {
      throw new BadRequestException('종료 시간은 시작 시간보다 이후여야 합니다.');
    }

    const exists = await this.eventModel.findOne({ name: dto.name });

    if (exists) {
      throw new ConflictException('동일한 이름의 이벤트가 존재합니다.');
    }

    const newEvent = EventSchema.createEvent(dto);
    const createdEvent = new this.eventModel(newEvent);
    await createdEvent.save();

    const response: ResponseDto = {
      statusCode: HttpStatus.CREATED,
      message: '이벤트가 성공적으로 생성되었습니다.',
      data: createdEvent._id.toString(),
    };

    return response;
  }

  async updateEvent(id: string, dto: UpdateEventDto): Promise<ResponseIdDto> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }

    const now = dayjs();

    const incomingStart = dto.startAt ? dayjs(dto.startAt) : null;
    const incomingEnd = dto.endAt ? dayjs(dto.endAt) : null;
    const currentStart = dayjs(event.startAt);
    const currentEnd = dayjs(event.endAt);

    // 1. 시작 시간 검증
    if (incomingStart) {
      if (!incomingStart.isAfter(now)) {
        throw new BadRequestException('시작 시간은 현재 시간보다 이후여야 합니다.');
      }

      if (!incomingStart.isBefore(currentEnd)) {
        throw new BadRequestException('시작 시간은 기존 종료 시간보다 이전이어야 합니다.');
      }
    }

    // 2. 종료 시간 검증
    if (incomingEnd) {
      const compareStart = incomingStart ?? currentStart;
      if (!incomingEnd.isAfter(compareStart)) {
        throw new BadRequestException('종료 시간은 시작 시간보다 이후여야 합니다.');
      }
    }

    event.updateEvent(dto);
    const updatedEvent = await event.save();

    const response: ResponseIdDto = {
      statusCode: HttpStatus.OK,
      message: '이벤트가 성공적으로 수정되었습니다.',
      data: updatedEvent._id.toString(),
    };

    return response;
  }

  async getEvents(query: EventFilterDto): Promise<EventListResponseDto[]> {
    const filter: any = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.startAt) {
      filter.startAt = { $gte: new Date(query.startAt) };
    }

    if (query.endAt) {
      filter.endAt = filter.endAt || {};
      filter.endAt.$lte = new Date(query.endAt);
    }

    const page = query.page;
    const limit = query.limit;

    const events = await this.eventModel
      .find(filter)
      .sort({ startAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const response = events.map((event) => {
      const dto: EventListResponseDto = {
        id: event._id.toString(),
        name: event.name,
        type: event.type,
        status: event.status,
        startAt: event.startAt,
        endAt: event.endAt,
      };
      return dto;
    });

    return response;
  }

  async getEventById(id: string): Promise<EventDetailResponseDto> {
    const event = await this.eventModel.findById(id).populate('rewards').lean();

    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    const response: EventDetailResponseDto = {
      id: event._id.toString(),
      name: event.name,
      description: event.description,
      type: event.type,
      status: event.status,
      startAt: event.startAt,
      endAt: event.endAt,
      conditions: event.conditions,
      rewards: (event.rewards as any[]).map((reward) => ({
        id: reward._id.toString(),
        name: reward.name,
        description: reward.description,
        items: reward.items.map((ri) => ({
          item: ri.item.toString(),
          quantity: ri.quantity,
        })),
      })),
    };
    return response;
  }

  // 현재 시간기준 종료시간이 과거인 것들은 상태 CLOSED로 변경
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateExpiredEvents(): Promise<void> {
    const now = dayjs().toDate();

    const expiredEvents = await this.eventModel.find({
      status: EventStatus.ACTIVE,
      endAt: { $lt: now },
    });

    if (expiredEvents.length === 0) {
      this.logger.log('만료된 이벤트가 없습니다.');
      return;
    }

    const ids = expiredEvents.map((e) => e._id);

    await this.eventModel.updateMany(
      { _id: { $in: ids } },
      { $set: { status: EventStatus.CLOSED } },
    );

    this.logger.log(`${expiredEvents.length}개의 이벤트가 종료되었습니다`);
  }

  // 이벤트 조건 평가
  async evaluateEventCondition(
    dto: EvaluateEventConditionDto,
  ): Promise<ConditionEvaluationResultDto> {
    const event = await this.eventModel.findById(dto.eventId);
    if (!event) {
      throw new NotFoundException('이벤트 정보가 존재하지 않습니다.');
    }
    const user = await this.userService.findById(dto.userId);
    if (!user) {
      throw new NotFoundException('유저 정보가 존재하지 않습니다.');
    }
    for (const condition of event.conditions ?? []) {
      const passed = await this.evaluateCondition(user, condition);

      if (!passed) {
        return {
          condition,
          passed: false,
          message: `${condition} 조건을 충족하지 못했습니다.`,
        };
      }
    }

    return {
      passed: true,
    };
  }

  private async evaluateCondition(user: UserDocument, condition: ConditionType): Promise<boolean> {
    switch (condition) {
      // 출석 관련
      case Condition.ATTENDANCE_DAYS_7:
        return await this.checkTotalDays(user, 7);

      case Condition.ATTENDANCE_DAYS_30:
        return await this.checkTotalDays(user, 30);

      case Condition.CONSECUTIVE_DAYS_7:
        return await this.checkConsecutiveDays(user, 7);

      case Condition.CONSECUTIVE_DAYS_14:
        return await this.checkConsecutiveDays(user, 14);

      case Condition.DAILY_ATTENDANCE:
        return await this.checkTodayLogin(user);

      // 포인트 사용
      case Condition.USED_POINTS_OVER_500:
        return await this.checkUsedPoints(user, 500);

      case Condition.REWARD_LEGENDARY_ACQUIRED:
        return await this.checkLegendaryRewardAcquired(user);

      // 친구 초대
      case Condition.FRIEND_INVITE_OVER_10:
        return await this.checkInvitedCount(user, 10); // 10명 이상 초대했는지

      // 친구 초대
      case Condition.FRIEND_INVITE_OVER_30:
        return await this.checkInvitedCount(user, 30); // 30명 이상 초대했는지

      // 리워드 획득
      case Condition.REWARD_COUNT_OVER_10:
        return await this.checkRewardCount(user, 10);

      default:
        return false;
    }
  }

  // 누적 일수가 일정 수를 넘었을때 보상
  private async checkTotalDays(user: UserDocument, minDays: number): Promise<boolean> {
    return user.attendanceDates.length >= minDays;
  }

  // 연속 일수가 일정 수를 넘었을 때 보상
  private async checkConsecutiveDays(user: UserDocument, minDays: number): Promise<boolean> {
    return user.continuousAttendanceCount >= minDays;
  }

  // 유저가 오늘 접속했을 때
  private async checkTodayLogin(user: UserDocument): Promise<boolean> {
    const today = dayjs().format('YYYY-MM-DD');
    return user.attendanceDates.includes(today);
  }

  // 유저 사용 포인트가 특정 값을 넘었을 떄
  private async checkUsedPoints(user: UserDocument, minPoints: number): Promise<boolean> {
    return user.usedPoints >= minPoints;
  }

  // 유저가 레전더리 보상을 가지고 있을 때
  private async checkLegendaryRewardAcquired(user: UserDocument): Promise<boolean> {
    return await this.rewardService.hasAcquiredLegendaryReward(user);
  }

  private async checkInvitedCount(user: UserDocument, minCount: number): Promise<boolean> {
    return user.inviteCount >= minCount;
  }

  private async checkRewardCount(user: UserDocument, minCount: number): Promise<boolean> {
    const totalReceived = Object.values(user.receivedRewards).reduce(
      (sum, reward) => sum + reward.quantity,
      0,
    );

    return totalReceived >= minCount;
  }

  // daily event 생성
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createDailyEventIfNotExists(): Promise<void> {
    const today = dayjs().format('YYYY-MM-DD');
    const name = `일일 출석 이벤트 - ${today}`;

    const existing = await this.eventModel.findOne({ name });
    if (existing) return;

    // 보상 조회 또는 생성
    const reward = await this.rewardService.getDailyReward();

    const event = new this.eventModel({
      name,
      description: '매일 참여하는 출석 이벤트입니다.',
      type: EventConst.DAILY_ATTENDANCE,
      startAt: dayjs().startOf('day').toDate(),
      endAt: dayjs().endOf('day').toDate(),
      status: EventStatus.ACTIVE,
      rewards: [reward._id],
      conditions: [Condition.DAILY_ATTENDANCE],
    });

    await event.save();
  }
}
