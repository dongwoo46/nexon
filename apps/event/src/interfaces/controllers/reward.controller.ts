import { Controller, Get } from '@nestjs/common';
import { ItemService } from '../../application/item.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateItemDto, CreateRewardDto, ResponseDto } from '@libs/dto';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { RewardService } from '../../application/reward.service';
@Controller()
export class ItemController {
  constructor(private readonly rewardService: RewardService) {}

  @MessagePattern(EventMessagePatternConst.REWARD_CREATED)
  async createItem(@Payload() dto: CreateRewardDto): Promise<ResponseDto> {
    return await this.rewardService.createReward(dto);
  }
}
