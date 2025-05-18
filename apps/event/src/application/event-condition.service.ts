import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventCondition, EventConditionDocument } from '../domain/schemas/event-condition.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventConditionReqDto, ResponseDto } from '@libs/dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EventConditionService {
  constructor(
    @InjectModel(EventCondition.name)
    private readonly eventConditionModel: Model<EventConditionDocument>,
  ) {}

  // 이벤트 조건 생성
  async createEventConditions(dtos: CreateEventConditionReqDto[]): Promise<ResponseDto> {
    const session = await this.eventConditionModel.db.startSession();
    session.startTransaction();

    try {
      const docs = dtos.map((dto) => EventCondition.createEventCondition(dto));
      await this.eventConditionModel.insertMany(docs, { session });

      await session.commitTransaction();
      session.endSession();

      const response: ResponseDto = {
        statusCode: HttpStatus.CREATED,
        message: '이벤트 조건이 성공적으로 생성되었습니다.',
      };
      return response;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw new RpcException(
        new InternalServerErrorException(`이벤트 조건 생성 실패: ${error.message}`),
      );
    }
  }
}
