import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, getConnectionToken } from '@nestjs/mongoose';
import { RewardRequestService } from '../application/reward-request.service';
import { EventService } from '../application/event.service';
import { UserService } from 'apps/auth/src/application/user.service';
import { RewardRequest } from '../domain/schemas/reward-request.schema';
import { CreateRewardRequestDto } from '@libs/dto';
import { RewardRequestStatus } from '@libs/constants';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('RewardRequestService', () => {
  let service: RewardRequestService;
  let rewardRequestModel: any;
  let eventServiceMock: any;
  let userServiceMock: any;
  let connectionMock: any;
  let saveMock: jest.Mock;

  beforeEach(async () => {
    saveMock = jest.fn();

    const mockInstance = {
      _id: new Types.ObjectId(),
      save: saveMock,
    };

    rewardRequestModel = jest.fn().mockImplementation(() => mockInstance);
    rewardRequestModel.findOne = jest.fn();
    rewardRequestModel.findById = jest.fn();
    rewardRequestModel.find = jest.fn();
    rewardRequestModel.countDocuments = jest.fn();
    rewardRequestModel.create = jest.fn();

    eventServiceMock = {
      evaluateEventCondition: jest.fn(),
    };

    userServiceMock = {
      findById: jest.fn(),
    };

    connectionMock = {
      startSession: jest.fn().mockResolvedValue({
        startTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        endSession: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardRequestService,
        {
          provide: getModelToken(RewardRequest.name),
          useValue: rewardRequestModel,
        },
        {
          provide: EventService,
          useValue: eventServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: getConnectionToken(),
          useValue: connectionMock,
        },
      ],
    }).compile();

    service = module.get<RewardRequestService>(RewardRequestService);
  });

  describe('createRewardRequest', () => {
    it('조건 실패 시 상태는 SUCCESS가 아닌 상태로 저장', async () => {
      rewardRequestModel.findOne.mockResolvedValue(null);
      eventServiceMock.evaluateEventCondition.mockResolvedValue({ passed: false });

      const dto: CreateRewardRequestDto = {
        user: new Types.ObjectId().toString(),
        event: new Types.ObjectId().toString(),
        rewards: [new Types.ObjectId().toString()],
        status: RewardRequestStatus.FAILED,
      };

      const result = await service.createRewardRequest(dto);

      expect(eventServiceMock.evaluateEventCondition).toHaveBeenCalled();
      expect(userServiceMock.findById).not.toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(result.statusCode).toBe(201);
    });

    it(' 조건 통과 시 보상 지급되고 유저 저장됨', async () => {
      rewardRequestModel.findOne.mockResolvedValue(null);
      eventServiceMock.evaluateEventCondition.mockResolvedValue({ passed: true });

      const userSave = jest.fn();
      userServiceMock.findById.mockResolvedValue({
        receivedRewards: {},
        save: userSave,
      });

      const dto: CreateRewardRequestDto = {
        user: new Types.ObjectId().toString(),
        event: new Types.ObjectId().toString(),
        rewards: [new Types.ObjectId().toString()],
        status: RewardRequestStatus.PENDING,
      };

      const result = await service.createRewardRequest(dto);

      expect(userServiceMock.findById).toHaveBeenCalled();
      expect(userSave).toHaveBeenCalled();
      expect(result.statusCode).toBe(201);
    });

    it('유저가 존재하지 않으면 NotFoundException', async () => {
      rewardRequestModel.findOne.mockResolvedValue(null);
      eventServiceMock.evaluateEventCondition.mockResolvedValue({ passed: true });
      userServiceMock.findById.mockResolvedValue(null);

      const dto: CreateRewardRequestDto = {
        user: new Types.ObjectId().toString(),
        event: new Types.ObjectId().toString(),
        rewards: [new Types.ObjectId().toString()],
        status: RewardRequestStatus.PENDING,
      };

      await expect(service.createRewardRequest(dto)).rejects.toThrow(NotFoundException);
    });

    it('이미 요청된 보상이면 ConflictException', async () => {
      rewardRequestModel.findOne.mockResolvedValue({ _id: 'exists' });

      const dto: CreateRewardRequestDto = {
        user: new Types.ObjectId().toString(),
        event: new Types.ObjectId().toString(),
        rewards: [new Types.ObjectId().toString()],
        status: RewardRequestStatus.PENDING,
      };

      await expect(service.createRewardRequest(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateRewardRequestWithEvaluateConditions', () => {
    it('조건 미통과 시 BadRequestException 발생', async () => {
      const fakeId = new Types.ObjectId().toString();
      const fakeRewardRequest = {
        _id: fakeId,
        user: new Types.ObjectId(),
        event: new Types.ObjectId(),
        rewards: [new Types.ObjectId()],
        updateRewardRequest: jest.fn(),
        save: jest.fn(),
      };

      rewardRequestModel.findById = jest.fn().mockReturnValue({
        session: jest.fn().mockResolvedValue(fakeRewardRequest),
      });
      eventServiceMock.evaluateEventCondition.mockResolvedValue({ passed: false });

      const dto = {
        id: fakeId,
        status: RewardRequestStatus.SUCCESS,
        content: '성공입니다',
      };

      await expect(service.updateRewardRequestWithEvaluateConditions(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('조건 통과 시 유저 보상 업데이트됨', async () => {
      const fakeId = new Types.ObjectId().toString();
      const fakeUser = {
        receivedRewards: {},
        save: jest.fn(),
      };

      const fakeRewardId = new Types.ObjectId();

      const fakeRewardRequest = {
        _id: fakeId,
        user: new Types.ObjectId(),
        event: new Types.ObjectId(),
        rewards: [fakeRewardId],
        updateRewardRequest: jest.fn(),
        save: jest.fn(),
      };

      rewardRequestModel.findById = jest.fn().mockReturnValue({
        session: jest.fn().mockResolvedValue(fakeRewardRequest),
      });

      eventServiceMock.evaluateEventCondition.mockResolvedValue({ passed: true });
      userServiceMock.findById.mockResolvedValue(fakeUser);

      const dto = {
        id: fakeId,
        status: RewardRequestStatus.SUCCESS,
        content: '보상 성공!',
      };

      const result = await service.updateRewardRequestWithEvaluateConditions(dto);

      expect(fakeRewardRequest.updateRewardRequest).toHaveBeenCalledWith(dto);
      expect(userServiceMock.findById).toHaveBeenCalledWith(fakeRewardRequest.user.toString());
      expect(fakeUser.save).toHaveBeenCalled();
      expect(fakeRewardRequest.save).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
    });
  });

  describe('getRewardRequestsByUser', () => {
    it('userId에 해당하는 보상 요청 목록 반환', async () => {
      const userId = new Types.ObjectId().toString();

      // 1. 모킹 결과
      const mockedLeanResult = [
        {
          _id: new Types.ObjectId(),
          event: { name: '출석 이벤트' },
          rewards: [{ name: '출석 보상1' }, { name: '출석 보상2' }],
          status: RewardRequestStatus.SUCCESS,
          content: '완료!',
          createdAt: new Date(),
        },
      ];

      // 2. 체이닝으로 몽구에서 조회시 쓰는 함수 모킹
      const leanMock = jest.fn().mockResolvedValue(mockedLeanResult);
      const sortMock = jest.fn().mockReturnValue({ lean: leanMock });
      const selectMock = jest.fn().mockReturnValue({ sort: sortMock });
      const populateRewardsMock = jest.fn().mockReturnValue({ select: selectMock });
      const populateEventMock = jest.fn().mockReturnValue({ populate: populateRewardsMock });

      rewardRequestModel.find = jest.fn().mockReturnValue({ populate: populateEventMock });

      // 3. 테스트 실행
      const result = await service.getRewardRequestsByUser(userId);

      // 4. 검증
      expect(rewardRequestModel.find).toHaveBeenCalledWith({ user: userId });
      expect(populateEventMock).toHaveBeenCalledWith({ path: 'event', select: 'name' });
      expect(populateRewardsMock).toHaveBeenCalledWith({ path: 'rewards', select: 'name' });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockedLeanResult[0]._id.toString(),
        eventName: '출석 이벤트',
        rewards: ['출석 보상1', '출석 보상2'],
        status: RewardRequestStatus.SUCCESS,
        content: '완료!',
        createdAt: mockedLeanResult[0].createdAt,
      });
    });
  });

  describe('getRewardRequestsByFilter', () => {
    it(' 필터 적용된 요청 목록 반환', async () => {
      const filter = {
        user: 'userId123',
        event: 'eventId123',
        status: RewardRequestStatus.PENDING,
        page: 2,
        limit: 10,
      };

      const fakeRequests = [
        {
          _id: new Types.ObjectId(),
          user: new Types.ObjectId(),
          event: new Types.ObjectId(),
          rewards: [new Types.ObjectId()],
          status: RewardRequestStatus.PENDING,
          content: '요청',
          createdAt: new Date(),
        },
      ];

      const leanMock = jest.fn().mockResolvedValue(fakeRequests);
      const limitMock = jest.fn().mockReturnValue({ lean: leanMock });
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      const sortMock = jest.fn().mockReturnValue({ skip: skipMock });
      const selectMock = jest.fn().mockReturnValue({ sort: sortMock });

      rewardRequestModel.find = jest.fn().mockReturnValue({ select: selectMock });
      rewardRequestModel.countDocuments = jest.fn().mockResolvedValue(1);

      const result = await service.getRewardRequestsByFilter(filter);

      expect(rewardRequestModel.find).toHaveBeenCalledWith({
        user: filter.user,
        event: filter.event,
        status: filter.status,
      });

      expect(result.statusCode).toBe(200);
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(10);
      expect(result.data.total).toBe(1);
      expect(result.data.requests.length).toBe(1);
    });
  });

  describe('getRewardRequestDetail', () => {
    it('특정 요청 상세 조회', async () => {
      const id = new Types.ObjectId().toString();

      const fakeDetail = {
        _id: new Types.ObjectId(),
        event: { name: '이벤트1' },
        rewards: [{ name: '보상1' }],
        user: { name: '유저1' },
        status: RewardRequestStatus.SUCCESS,
        content: '성공',
        createdAt: new Date(),
      };

      // mock 순서: findById → populate → lean
      const leanMock = jest.fn().mockResolvedValue(fakeDetail);
      const populateMock = jest.fn().mockReturnValue({ lean: leanMock });

      rewardRequestModel.findById = jest.fn().mockReturnValue({
        populate: populateMock,
      });

      const result = await service.getRewardRequestDetail(id);

      expect(rewardRequestModel.findById).toHaveBeenCalledWith(id);
      expect(populateMock).toHaveBeenCalledWith([
        { path: 'event' },
        { path: 'rewards' },
        { path: 'user' },
      ]);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(fakeDetail);
    });
  });

  describe('evaluatePendingRewardRequests', () => {
    let session: any;

    beforeEach(() => {
      session = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };

      connectionMock.startSession.mockResolvedValue(session);
    });

    it('조건 통과 시 유저 자동 보상 지급', async () => {
      const rewardId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const requestMock = {
        _id: new Types.ObjectId(),
        user: userId,
        event: new Types.ObjectId(),
        rewards: [rewardId],
        status: RewardRequestStatus.PENDING,
        content: undefined,
        save: jest.fn(),
      };

      const userMock = {
        receivedRewards: {},
        save: jest.fn(),
      };

      rewardRequestModel.find = jest.fn().mockReturnValue({
        session: jest.fn().mockResolvedValue([requestMock]),
      });

      eventServiceMock.evaluateEventCondition.mockResolvedValue({ passed: true });
      userServiceMock.findById.mockResolvedValue(userMock);

      await service.evaluatePendingRewardRequests();

      expect(userMock.receivedRewards[rewardId.toString()].quantity).toBe(1);
      expect(requestMock.status).toBe(RewardRequestStatus.SUCCESS);
      expect(requestMock.content).toBe('자동 평가 성공');
      expect(userMock.save).toHaveBeenCalled();
      expect(requestMock.save).toHaveBeenCalled();
      expect(session.commitTransaction).toHaveBeenCalled();
    });

    it(' 조건 실패 시 실패 상태 저장', async () => {
      const requestMock = {
        _id: new Types.ObjectId(),
        user: new Types.ObjectId(),
        event: new Types.ObjectId(),
        rewards: [new Types.ObjectId()],
        status: RewardRequestStatus.PENDING,
        save: jest.fn(),
        content: '조건 실패!',
      };

      rewardRequestModel.find = jest.fn().mockReturnValue({
        session: jest.fn().mockResolvedValue([requestMock]),
      });

      eventServiceMock.evaluateEventCondition.mockResolvedValue({
        passed: false,
        message: '조건 실패!',
      });

      await service.evaluatePendingRewardRequests();

      expect(requestMock.status).toBe(RewardRequestStatus.FAILED);
      expect(requestMock.content).toBe('조건 실패!');
      expect(requestMock.save).toHaveBeenCalled();
      expect(session.commitTransaction).toHaveBeenCalled();
    });

    it('pending 요청 없으면 아무것도 안함', async () => {
      const logSpy = jest.spyOn(service['logger'], 'log');

      rewardRequestModel.find = jest.fn().mockReturnValue({
        session: jest.fn().mockResolvedValue([]),
      });

      await service.evaluatePendingRewardRequests();

      expect(logSpy).toHaveBeenCalledWith('[자동보상] 0건 평가 및 처리 완료');
      expect(session.commitTransaction).toHaveBeenCalled();
    });
  });
});
