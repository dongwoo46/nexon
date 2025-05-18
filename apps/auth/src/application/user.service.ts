import { Injectable, BadRequestException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/schemas/user.schema';
import { SignUpReqDto, SignUpResDto } from '@libs/dto';
import { RpcException } from '@nestjs/microservices';
import { Role, RoleType } from '../domain/types/role.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @param dto : 유저 회원가입 정보
   * @returns
   */
  async createUser(dto: SignUpReqDto): Promise<SignUpResDto> {
    const exists = await this.userModel.findOne({ email: dto.email });

    // 일반 사용자가 아닌 다른 특수 관리자의 경우 특수키로 아무나 가입할 수 없도록 제한
    if (['ADMIN', 'AUDITOR', 'OPERATOR'].includes(dto.role)) {
      let expectedKey: string = '';
      switch (dto.role) {
        case 'ADMIN':
          expectedKey = this.configService.get<string>('ADMIN_SECRETKEY') ?? '';
          break;
        case 'AUDITOR':
          expectedKey = this.configService.get<string>('AUDITOR_SECRETKEY') ?? '';
          break;
        case 'OPERATOR':
          expectedKey = this.configService.get<string>('OPERATOR_SECRETKEY') ?? '';
          break;
      }
      if (!expectedKey || dto.secretKey !== expectedKey) {
        throw new RpcException(new ForbiddenException(`${dto.role}으로 회원가입 권한이 없습니다.`));
      }
    }

    if (exists) {
      throw new RpcException(new BadRequestException('이미 존재하는 이메일입니다.'));
    }

    if (dto.password !== dto.confirmPassword) {
      throw new RpcException(new BadRequestException('비밀번호가 일치하지 않습니다.'));
    }

    const newUser = await User.signUpUser(dto);
    const createdUser = new this.userModel(newUser);
    await createdUser.save();
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입이 완료되었습니다.',
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
}
