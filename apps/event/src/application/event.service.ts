import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto, ResponseDto } from '@libs/dto';
import { Event as EventSchema, EventDocument } from '../domain/schemas/event.schema'; // ✅ 이름 충돌 방지

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventSchema.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async createEvent(dto: CreateEventDto): Promise<ResponseDto> {
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
}
