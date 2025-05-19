import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import {
  ConditionEvaluationResultDto,
  CreateItemDto,
  CreateRewardDto,
  CreateRewardRequestDto,
  EventDetailResponseDto,
  EventListResponseDto,
  ResponseDto,
  UpdateEventPayloadDto,
  UpdateRewardRequestPayloadDto,
} from '@libs/dto';
import { CreateEventDto } from '@libs/dto/event/request/create-event.dto';
import { EvaluateEventConditionDto } from '@libs/dto/event/request/evaluate-event-condition.dto';
import { EventFilterDto } from '@libs/dto/event/request/event-filter.dto';
import { RewardRequestFilterDto } from '@libs/dto/event/request/reward-request-filter.dto';
import { ResponseIdDto } from '@libs/dto/event/response/response-id-dto.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventGatewayService {
  private readonly logger = new Logger(EventGatewayService.name);

  constructor(@Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy) {}

  //아이템 생성
  async createItem(dto: CreateItemDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateItemDto>(EventMessagePatternConst.ITEM_CREATED, dto),
    );
  }

  // 보상 생성
  async createRewawrd(dto: CreateRewardDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateRewardDto>(
        EventMessagePatternConst.REWARD_CREATED,
        dto,
      ),
    );
  }

  // 이벤트 생성
  async createEvent(dto: CreateEventDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateEventDto>(
        EventMessagePatternConst.EVENT_CREATED,
        dto,
      ),
    );
  }

  // 보상 요청 생성
  async createRewardRequest(dto: CreateRewardRequestDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, CreateRewardRequestDto>(
        EventMessagePatternConst.REWARD_REQUEST_CREATED,
        dto,
      ),
    );
  }

  // 이벤트 목록 조회
  async getEventList(filter: EventFilterDto): Promise<EventListResponseDto[]> {
    return await firstValueFrom(
      this.eventClient.send<EventListResponseDto[], EventFilterDto>(
        EventMessagePatternConst.EVENT_LIST,
        filter,
      ),
    );
  }

  //이벤트 상세 조회
  async getEventDetail(id: string): Promise<EventDetailResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<EventDetailResponseDto, string>(
        EventMessagePatternConst.EVENT_DETAIL,
        id,
      ),
    );
  }

  // 유저 본인 보상 요청 이력 조회
  async getMyRewardRequests(userId: string): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, string>(
        EventMessagePatternConst.REWARD_REQUEST_LIST_BY_USER,
        userId,
      ),
    );
  }

  // 관리자 전체 요청 이력 필터 조회
  async getAllRewardRequests(filter: RewardRequestFilterDto): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, RewardRequestFilterDto>(
        EventMessagePatternConst.REWARD_REQUEST_LIST_ALL,
        filter,
      ),
    );
  }

  // 관리자 보상 요청 상세 조회
  async getRewardRequestDetail(id: string): Promise<ResponseDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseDto, string>(
        EventMessagePatternConst.REWARD_REQUEST_DETAIL,
        id,
      ),
    );
  }

  // 이벤트 수정
  async updateEvent(dto: UpdateEventPayloadDto): Promise<ResponseIdDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseIdDto, UpdateEventPayloadDto>(
        EventMessagePatternConst.EVENT_UPDATED,
        dto,
      ),
    );
  }

  // 보상 요청 수정
  async updateRewardRequestWithEvaluateConditions(
    dto: UpdateRewardRequestPayloadDto,
  ): Promise<ResponseIdDto> {
    return await firstValueFrom(
      this.eventClient.send<ResponseIdDto, UpdateRewardRequestPayloadDto>(
        EventMessagePatternConst.REWARD_REQUEST_UPDATE,
        dto,
      ),
    );
  }

  // 사용자 이벤트 조건 충족 여부 평가
  async evaluateEventCondition(
    dto: EvaluateEventConditionDto,
  ): Promise<ConditionEvaluationResultDto> {
    return await firstValueFrom(
      this.eventClient.send<ConditionEvaluationResultDto, EvaluateEventConditionDto>(
        EventMessagePatternConst.EVENT_EVALUATE_CONDITIONS,
        dto,
      ),
    );
  }
}
