import { Controller, Get, HttpStatus, Logger } from '@nestjs/common';
import { ItemService } from '../../application/item.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CreateItemDto,
  CreateRewardRequestDto,
  ResponseDto,
  UpdateRewardRequestPayloadDto,
} from '@libs/dto';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { RewardRequestService } from '../../application/reward-request.service';
import { RewardRequestFilterDto } from '@libs/dto/event/request/reward-request-filter.dto';
import { ResponseIdDto } from '@libs/dto/event/response/response-id-dto.dto';
@Controller()
export class RewardRequestController {
  private readonly logger = new Logger(RewardRequestController.name);

  constructor(private readonly rewardRequestService: RewardRequestService) {}

  // 보상 요청 생성
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_CREATED)
  async createItem(@Payload() dto: CreateRewardRequestDto): Promise<ResponseDto> {
    try {
      return await this.rewardRequestService.createRewardRequest(dto);
    } catch (err) {
      this.logger.log(err);
      throw new RpcException(err);
    }
  }

  // 유저 본인 보상 요청 이력 조회
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_LIST_BY_USER)
  async getMyRewardRequests(@Payload() userId: string) {
    try {
      const data = await this.rewardRequestService.getRewardRequestsByUser(userId);
      return {
        statusCode: HttpStatus.OK,
        message: '유저 보상 요청 이력 조회 성공',
        data,
      };
    } catch (err) {
      this.logger.log(err);
      throw new RpcException(err);
    }
  }

  //관리자 전체 요청 이력 조회
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_LIST_ALL)
  async getAllRewardRequests(@Payload() filter: RewardRequestFilterDto) {
    try {
      const result = await this.rewardRequestService.getRewardRequestsByFilter(filter);
      return result;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  // 보상 요청 상세조회
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_DETAIL)
  async getRewardRequestDetail(@Payload() id: string) {
    try {
      const result = await this.rewardRequestService.getRewardRequestDetail(id);
      return result;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  // 보상 요청 상태 수정
  @MessagePattern(EventMessagePatternConst.REWARD_REQUEST_UPDATE)
  async updateRewardRequestWithEvaluateConditions(
    dto: UpdateRewardRequestPayloadDto,
  ): Promise<ResponseIdDto> {
    try {
      const result = await this.rewardRequestService.updateRewardRequestWithEvaluateConditions(dto);
      return result;
    } catch (err) {
      this.logger.log(err);
      throw new RpcException(err);
    }
  }
}
