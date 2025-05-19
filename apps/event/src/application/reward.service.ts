import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { Reward, RewardDocument } from '../domain/schemas/reward.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRewardDto, ResponseDto } from '@libs/dto';

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private readonly rewardModel: Model<RewardDocument>) {}

  async createReward(dto: CreateRewardDto): Promise<ResponseDto> {
    const existing = await this.rewardModel.findOne({ name: dto.name }).exec();
    if (existing) {
      throw new ConflictException(`이미 동일한 이름${dto.name}의 보상이 존재합니다.`);
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
}
