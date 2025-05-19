import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventService } from '../application/event.service';
import { RewardService } from '../application/reward.service';
import { UserService } from 'apps/auth/src/application/user.service';

describe('EventService (Daily Event)', () => {
  let service: EventService;
  let rewardServiceMock: any;
  let findOneMock: jest.Mock;
  let saveMock: jest.Mock;
  let saveSpy: jest.Mock;

  // 1. 커스텀 Mock 클래스
  class EventModelMock {
    static findOne = jest.fn();
    save: jest.Mock;

    constructor(data: any) {
      Object.assign(this, data);
      this.save = saveSpy = jest.fn();
    }
  }

  beforeEach(async () => {
    findOneMock = jest.fn();
    saveMock = jest.fn();

    rewardServiceMock = {
      getDailyReward: jest.fn(),
    };

    // findOne은 정적 메서드로 선언
    EventModelMock.findOne = findOneMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getModelToken(Event.name),
          useValue: EventModelMock,
        },
        {
          provide: RewardService,
          useValue: rewardServiceMock,
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('오늘 이벤트가 이미 있으면 아무것도 하지 않음', async () => {
    findOneMock.mockResolvedValue({ _id: 'existingEventId' });

    await service.createDailyEventIfNotExists();

    expect(findOneMock).toHaveBeenCalled();
    expect(rewardServiceMock.getDailyReward).not.toHaveBeenCalled();
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('오늘 이벤트가 없고 보상도 있으면 이벤트가 생성됨', async () => {
    findOneMock.mockResolvedValue(null);
    rewardServiceMock.getDailyReward.mockResolvedValue({ _id: 'rewardId123' });

    await service.createDailyEventIfNotExists();

    expect(findOneMock).toHaveBeenCalled();
    expect(rewardServiceMock.getDailyReward).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
  });
});
