import { ConflictException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from '../domain/schemas/reward-request.schema';
import { CreateRewardRequestDto, ResponseDto } from '@libs/dto';
import { RewardRequestFilterDto } from '@libs/dto/event/request/reward-request-filter.dto';
import { RewardRequestSummaryDto } from '@libs/dto/event/request/reward-request-summary.dto';

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
