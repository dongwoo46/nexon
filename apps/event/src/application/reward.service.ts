import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Reward, RewardDocument } from '../domain/schemas/reward.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRewardDto, ResponseDto } from '@libs/dto';
import * as dayjs from 'dayjs';
import { EventConst } from '@libs/constants';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private readonly rewardModel: Model<RewardDocument>) {}

  async createReward(dto: CreateRewardDto): Promise<ResponseDto> {
    const existing = await this.rewardModel.findOne({ name: dto.name }).exec();
    if (existing) {
      throw new RpcException(
        new ConflictException(`이미 동일한 이름${dto.name}의 보상이 존재합니다.`),
      );
    }

    const newReward = Reward.createReward(dto);
    const reward = new this.rewardModel(newReward);
    await reward.save();
    const response: ResponseDto = {
      statusCode: HttpStatus.CREATED,
      message: '보상 생성 완료하였습니다.',
    };
    return response;
  }

  // 가장 최신으로 생성된 daily_attendce인 reward가 우선적용
  async getDailyReward(): Promise<RewardDocument> {
    const reward = await this.rewardModel
      .findOne({ rewardKey: EventConst.DAILY_ATTENDANCE })
      .sort({ createdAt: -1 })
      .lean();

    if (!reward) {
      throw new RpcException(
        new NotFoundException('DAILY_ATTENDANCE에 해당하는 보상이 존재하지 않습니다.'),
      );
    }

    return reward;
  }
}
