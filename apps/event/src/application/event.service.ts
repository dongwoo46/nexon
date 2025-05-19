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
import { EventStatus } from '@libs/constants';
import * as crypto from 'crypto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectModel(EventSchema.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async createEvent(dto: CreateEventDto): Promise<ResponseDto> {
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
      throw new RpcException(new ConflictException('동일한 이름의 이벤트가 존재합니다.'));
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
}
