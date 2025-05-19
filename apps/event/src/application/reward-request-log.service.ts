import { Injectable } from '@nestjs/common';
import {
  RewardRequestLog,
  RewardRequestLogDocument,
} from '../domain/schemas/reward-request-log.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRewardRequestLogDto } from '@libs/dto/event/request/create-reward-request-log.dto';

@Injectable()
export class RewardRequestLogService {
  constructor(
    @InjectModel(RewardRequestLog.name)
    private readonly rewardRequestLogModel: Model<RewardRequestLogDocument>,
  ) {}

  /**
   * 보상 요청 로그 저장
   * 자동 보상 요청 등 특정 행위로 발생하는 로그 저장용
   */
  async createRewardRequestLog(dto: CreateRewardRequestLogDto): Promise<void> {
    const log = RewardRequestLog.createLog(dto);
    const doc = new this.rewardRequestLogModel(log);
    await doc.save();
  }
}
