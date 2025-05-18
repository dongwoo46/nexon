import { Injectable } from '@nestjs/common';

@Injectable()
export class EventLogService {
  getHello(): string {
    return 'Hello World!';
  }
}
