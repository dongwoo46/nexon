import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from '../domain/schemas/item.schema';
import { Model } from 'mongoose';
import { CreateItemDto, ResponseDto } from '@libs/dto';
import { MaxItemCountByGrade } from '@libs/constants';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name)
    private readonly itemModel: Model<ItemDocument>,
  ) {}

  /**
   * 아이템 생성
   * @param dto
   * @returns
   */
  async createItem(dto: CreateItemDto): Promise<ResponseDto> {
    const exists = await this.itemModel.exists({ itemKey: dto.itemKey });
    if (exists) {
      throw new ConflictException(`이미 존재하는 아이템입니다: ${dto.itemKey}`);
    }

    // 만료시간 체크
    if (dto.expiresAt && dto.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('유효기간은 현재 시간 이후여야 합니다.');
    }

    // 무제한이면 상관 X , 무제한이 아닌 등급일 시 현재 DB에 남아있는 등급의 개수가 설정한 값보다 적어야함
    const maxCountByGrade = MaxItemCountByGrade[dto.grade];
    if (maxCountByGrade !== Infinity) {
      const currentCount = await this.itemModel.countDocuments({ grade: dto.grade });
      if (currentCount >= maxCountByGrade) {
        throw new BadRequestException(
          `해당 등급(${dto.grade})은 최대 ${maxCountByGrade}개까지 등록할 수 있습니다.`,
        );
      }
    }

    const newItem = Item.createItem(dto);
    const createdItem = new this.itemModel(newItem);

    try {
      await createdItem.save();
      const response: ResponseDto = {
        statusCode: HttpStatus.CREATED,
        message: '아이템이 성공적으로 생성되었습니다.',
      };
      return response;
    } catch (err) {
      throw new InternalServerErrorException(`아이템 생성 실패: ${err.message}`);
    }
  }
}
