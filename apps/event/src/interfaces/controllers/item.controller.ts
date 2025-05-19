import { Controller, Get } from '@nestjs/common';
import { ItemService } from '../../application/item.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateItemDto, ResponseDto } from '@libs/dto';
import { EventMessagePatternConst } from '@libs/constants/event-message-pattern.const';
@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern(EventMessagePatternConst.ITEM_CREATED)
  async createItem(@Payload() dto: CreateItemDto): Promise<ResponseDto> {
    try {
      return await this.itemService.createItem(dto);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
