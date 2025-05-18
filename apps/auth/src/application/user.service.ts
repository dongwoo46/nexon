import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/schemas/user.schema';
import { SignUpReqDto, SignUpResDto } from '@libs/dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * @param dto : 유저 회원가입 정보
   * @returns
   */
  async createUser(dto: SignUpReqDto): Promise<SignUpResDto> {
    const exists = await this.userModel.findOne({ email: dto.email });
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
