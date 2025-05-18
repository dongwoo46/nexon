import { Injectable } from '@nestjs/common';

@Injectable()
export class EventConditionService {
  getHello(): string {
    return 'Hello World!';
  }
}
