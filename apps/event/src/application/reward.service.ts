import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardService {
  getHello(): string {
    return 'Hello World!';
  }
}
