import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ItemService } from '../../application/item.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateItemDto, CreateRewardRequestDto, ResponseDto } from '@libs/dto';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { RewardRequestService } from '../../application/reward-request.service';
import { RewardRequestFilterDto } from '@libs/dto/event/request/reward-request-filter.dto';
@Controller()
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  // 보상 요청 생성
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_CREATED)
  async createItem(@Payload() dto: CreateRewardRequestDto): Promise<ResponseDto> {
    return await this.rewardRequestService.createRewardRequest(dto);
  }

  // 유저 본인 보상 요청 이력 조회
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_LIST_BY_USER)
  async getMyRewardRequests(@Payload() userId: string) {
    const data = await this.rewardRequestService.getRewardRequestsByUser(userId);
    return {
      statusCode: HttpStatus.OK,
      message: '유저 보상 요청 이력 조회 성공',
      data,
    };
  }

  //관리자 전체 요청 이력 조회
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_LIST_ALL)
  async getAllRewardRequests(@Payload() filter: RewardRequestFilterDto) {
    const data = await this.rewardRequestService.getRewardRequestsByFilter(filter);
    return {
      statusCode: HttpStatus.OK,
      message: '전체 보상 요청 이력 조회 성공',
      data,
    };
  }

  // 보상 요청 상세조회
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_DETAIL)
  async getRewardRequestDetail(@Payload() id: string) {
    const data = await this.rewardRequestService.getRewardRequestDetail(id);
    return {
      statusCode: HttpStatus.OK,
      message: '보상 요청 상세 조회 성공',
      data,
    };
  }
}
