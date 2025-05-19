import { Controller, Get } from '@nestjs/common';
import { ItemService } from '../../application/item.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateItemDto, CreateRewardRequestDto, ResponseDto } from '@libs/dto';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { RewardRequestService } from '../../application/reward-request.service';
@Controller()
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_CREATED)
  async createItem(@Payload() dto: CreateRewardRequestDto): Promise<ResponseDto> {
    return await this.rewardRequestService.createRewardRequest(dto);
  }
}
