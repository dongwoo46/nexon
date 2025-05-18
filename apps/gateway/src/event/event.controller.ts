import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { EventGatewayService } from './event.service';

@Controller('auth')
export class EventGatewayController {
  constructor(private readonly eventService: EventGatewayService) {}
}
