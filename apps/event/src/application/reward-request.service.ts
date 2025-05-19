import {
  ConflictException,
  Injectable,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from '../domain/schemas/reward-request.schema';
import { CreateRewardRequestDto, ResponseDto, UpdateRewardRequestPayloadDto } from '@libs/dto';
import { RewardRequestFilterDto } from '@libs/dto/event/request/reward-request-filter.dto';
import { RewardRequestSummaryDto } from '@libs/dto/event/request/reward-request-summary.dto';
import { RpcException } from '@nestjs/microservices';
import { RewardRequestStatus, RewardRequestStatusType } from '@libs/constants';
import { ResponseIdDto } from '@libs/dto/event/response/response-id-dto.dto';
import { EventService } from './event.service';
import { User, UserDocument } from 'apps/auth/src/domain/schemas/user.schema';
import { UserService } from 'apps/auth/src/application/user.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';

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
  private readonly logger = new Logger(RewardRequestService.name);

  constructor(
    @InjectModel(RewardRequest.name)
    private readonly rewardRequestModel: Model<RewardRequestDocument>,
    private readonly eventService: EventService,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly userService: UserService,
  ) {}

  async createRewardRequest(dto: CreateRewardRequestDto): Promise<ResponseDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const exists = await this.rewardRequestModel.findOne({
        user: dto.user,
        event: dto.event,
      });

      if (exists) {
        throw new ConflictException('이미 요청된 보상입니다.');
      }

      // 평가
      const result = await this.eventService.evaluateEventCondition({
        eventId: dto.event.toString(),
        userId: dto.user.toString(),
      });

      if (result.passed) {
        // 유저에 보상 추가
        const user = await this.userService.findById(dto.user.toString());

        if (!user) {
          throw new NotFoundException(` 유저가 존재하지 않습니다.`);
        }

        for (const rewardId of dto.rewards) {
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
        dto.status = RewardRequestStatus.SUCCESS;
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
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  // 보상 요청 상태 및 내용 수정
  async updateRewardRequestWithEvaluateConditions(
    dto: UpdateRewardRequestPayloadDto,
  ): Promise<ResponseIdDto> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const rewardRequest = await this.rewardRequestModel.findById(dto.id).session(session);
      if (!rewardRequest) {
        throw new NotFoundException('보상 요청이 존재하지 않습니다.');
      }

      // 보상 요청 상태 반영
      rewardRequest.updateRewardRequest(dto);

      // 성공으로 처리하기 위해서는 모든 이벤트 조건을 충족시켜야함
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
      status: r.status as RewardRequestStatusType,
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

    // 페이지네이션 기본값 처리
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      this.rewardRequestModel
        .find(query)
        .select(['_id', 'user', 'event', 'rewards', 'status', 'content', 'createdAt'])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.rewardRequestModel.countDocuments(query),
    ]);

    return {
      statusCode: HttpStatus.OK,
      message: '전체 보상 요청 이력 조회 성공',
      data: {
        total, // 전체 개수
        page, // 현재 페이지
        limit, // 페이지당 개수
        requests, // 요청 목록
      },
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

  // 매일 오전 6시 출근 전에 자동으로 보상 요청 상태가 fail, pending인 값들 조회하여 보상조건 체크후
  // 성공시 보상 지급
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async evaluatePendingRewardRequests(): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const start = dayjs().subtract(1, 'day').hour(6).minute(0).second(0).millisecond(0).toDate(); // 어제 06:00
      const end = dayjs().hour(6).minute(0).second(0).millisecond(0).toDate(); // 오늘 06:00

      const pendingRequests = await this.rewardRequestModel
        .find({
          status: { $in: [RewardRequestStatus.PENDING, RewardRequestStatus.FAILED] },
          createdAt: { $gte: start, $lt: end },
        })
        .session(session);

      for (const request of pendingRequests) {
        const result = await this.eventService.evaluateEventCondition({
          eventId: request.event.toString(),
          userId: request.user.toString(),
        });

        if (result.passed) {
          const user = await this.userService.findById(request.user.toString());
          if (!user) continue;

          for (const rewardId of request.rewards) {
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

          request.status = RewardRequestStatus.SUCCESS;
          request.content = '자동 평가 성공';
          await user.save({ session });
        } else {
          request.status = RewardRequestStatus.FAILED;
          request.content = result.message ?? '조건 미충족';
        }

        await request.save({ session });
      }

      await session.commitTransaction();
      this.logger.log(`[자동보상] ${pendingRequests.length}건 평가 및 처리 완료`);
    } catch (err) {
      await session.abortTransaction();
      this.logger.error('[자동보상 실패]', err);
      throw err;
    } finally {
      session.endSession();
    }
  }
}
