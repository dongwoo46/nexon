import { Controller, Get, Logger } from '@nestjs/common';
import { ItemService } from '../../application/item.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateItemDto, ResponseDto } from '@libs/dto';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
@Controller()
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(private readonly itemService: ItemService) {}

  @MessagePattern(EventMessagePatternConst.ITEM_CREATED)
  async createItem(@Payload() createItemDto: CreateItemDto): Promise<ResponseDto> {
    try {
      const dto = plainToInstance(CreateItemDto, createItemDto);
      await validateOrReject(dto);
      return await this.itemService.createItem(dto);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
