import { ConflictException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from '../domain/schemas/reward-request.schema';
import { CreateRewardRequestDto, ResponseDto } from '@libs/dto';

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
}
