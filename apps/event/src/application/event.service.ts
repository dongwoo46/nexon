import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateEventDto,
  EventDetailResponseDto,
  EventListResponseDto,
  ResponseDto,
} from '@libs/dto';
import { Event as EventSchema, EventDocument } from '../domain/schemas/event.schema'; // ✅ 이름 충돌 방지
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';
import { RpcException } from '@nestjs/microservices';
import * as dayjs from 'dayjs';

@Injectable()
export class EventService {
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
}
