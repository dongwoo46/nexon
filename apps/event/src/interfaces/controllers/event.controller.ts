import { Controller, Get } from '@nestjs/common';
import { EventService } from '../../application/event.service';
import { MessagePattern } from '@nestjs/microservices';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}
}
