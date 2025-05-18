import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardRequestService {
  getHello(): string {
    return 'Hello World!';
  }
}
