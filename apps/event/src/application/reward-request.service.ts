import {
  ConflictException,
  Injectable,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from '../domain/schemas/reward-request.schema';
import { CreateRewardRequestDto, ResponseDto, UpdateRewardRequestPayloadDto } from '@libs/dto';
import { RewardRequestFilterDto } from '@libs/dto/event/request/reward-request-filter.dto';
import { RewardRequestSummaryDto } from '@libs/dto/event/request/reward-request-summary.dto';
import { RpcException } from '@nestjs/microservices';
import { RewardRequestStatus } from '@libs/constants';
import { ResponseIdDto } from '@libs/dto/event/response/response-id-dto.dto';
import { EventService } from './event.service';
import { User, UserDocument } from 'apps/auth/src/domain/schemas/user.schema';
import { UserService } from 'apps/auth/src/application/user.service';

type PopulatedRequest = {
  _id: Types.ObjectId;
  event: { name: string };
  rewards: { name: string }[];
  status: string;
  content?: string;
  createdAt?: Date;
};

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name)
    private readonly rewardRequestModel: Model<RewardRequestDocument>,
    private readonly eventService: EventService,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly userService: UserService,
  ) {}

  async createRewardRequest(dto: CreateRewardRequestDto): Promise<ResponseDto> {
    const exists = await this.rewardRequestModel.findOne({
      user: dto.user,
      event: dto.event,
    });

    if (exists) {
      throw new ConflictException('이미 요청된 보상입니다.');
    }

    const newRewardRequest = RewardRequest.createRewardRequest(dto);
    const createdRewardRequest = new this.rewardRequestModel(newRewardRequest);
    await createdRewardRequest.save();

    const response: ResponseDto = {
      statusCode: HttpStatus.CREATED,
      message: '보상 요청이 성공적으로 생성되었습니다.',
      data: createdRewardRequest._id.toString(),
    };

    return response;
  }

  // 보상 요청 상태 및 내용 수정
  async updateRewardRequestWithEvaluateConditions(
    dto: UpdateRewardRequestPayloadDto,
  ): Promise<ResponseIdDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    const { status, ...safeDto } = dto;

    try {
      const rewardRequest = await this.rewardRequestModel.findById(dto.id).session(session);
      if (!rewardRequest) {
        throw new NotFoundException('보상 요청이 존재하지 않습니다.');
      }

      // 보상 요청 상태 반영
      rewardRequest.updateRewardRequest(dto);

      if (dto.status === RewardRequestStatus.SUCCESS) {
        const result = await this.eventService.evaluateEventCondition({
          eventId: rewardRequest.event.toString(),
          userId: rewardRequest.user.toString(),
        });

        if (!result.passed) {
          throw new BadRequestException(result.message ?? '이벤트 조건을 충족하지 못했습니다.');
        }

        // 유저에 보상 추가
        const user = await this.userService.findById(rewardRequest.user.toString());

        if (!user) {
          throw new NotFoundException(` 유저가 존재하지 않습니다.`);
        }

        for (const rewardId of rewardRequest.rewards) {
          const rewardIdStr = rewardId.toString();
          const now = new Date();

          if (user.receivedRewards[rewardIdStr]) {
            user.receivedRewards[rewardIdStr].quantity += 1;
          } else {
            user.receivedRewards[rewardIdStr] = {
              quantity: 1,
              acquiredAt: now,
            };
          }
        }

        await user.save({ session });
      }

      await rewardRequest.save({ session });
      await session.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        message: '보상 요청 상태 수정 완료',
        data: rewardRequest._id.toString(),
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  // 유저 본인 요청 이력 조회
  async getRewardRequestsByUser(userId: string): Promise<RewardRequestSummaryDto[]> {
    const requests = await this.rewardRequestModel
      .find({ user: userId })
      .populate({ path: 'event', select: 'name' })
      .populate({ path: 'rewards', select: 'name' })
      .select(['_id', 'event', 'rewards', 'status', 'content', 'createdAt'])
      .sort({ createdAt: -1 })
      .lean<PopulatedRequest[]>();

    return requests.map((r) => ({
      id: r._id.toString(),
      eventName: r.event.name,
      rewards: r.rewards.map((reward) => reward.name),
      status: r.status,
      content: r.content,
      createdAt: r.createdAt,
    }));
  }

  // 관리자용 전체 이력 조회
  async getRewardRequestsByFilter(filter: RewardRequestFilterDto): Promise<ResponseDto> {
    const query: any = {};

    if (filter.user) query.user = filter.user;
    if (filter.event) query.event = filter.event;
    if (filter.status) query.status = filter.status;

    const requests = await this.rewardRequestModel
      .find(query)
      .select(['_id', 'user', 'event', 'rewards', 'status', 'content', 'createdAt'])
      .sort({ createdAt: -1 })
      .lean();

    return {
      statusCode: HttpStatus.OK,
      message: '보상 요청 목록 조회 성공',
      data: requests,
    };
  }

  // 상세 조회
  async getRewardRequestDetail(id: string): Promise<ResponseDto> {
    const result = await this.rewardRequestModel
      .findById(id)
      .populate([{ path: 'event' }, { path: 'rewards' }, { path: 'user' }])
      .lean();

    return {
      statusCode: HttpStatus.OK,
      message: '보상 요청 상세 조회 성공',
      data: result,
    };
  }
}
