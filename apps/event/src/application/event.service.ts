import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  getHello(): string {
    return 'Hello World!';
  }
}
