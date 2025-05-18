import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginReqDto, LoginResDto } from '@libs/dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from '../domain/types/user-status.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    const user = await this.userModel.findOne({ email: dto.email });

    //사용자 회원가입 유무 체크
    if (!user) {
      throw new RpcException(new NotFoundException('존재하지 않는 사용자입니다.'));
    }

    // 사용자계정 활성화 여부 체크
    if (user.status !== UserStatus.ACTIVE) {
      throw new RpcException(new UnauthorizedException('사용할 수 없는 사용자입니다.'));
    }

    // 비밀번호 체크
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new RpcException(
        new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.'),
      );
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      jti: uuidv4(), // jwt 로그인마다 다른 jwt 발급
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      statusCode: HttpStatus.OK,
      message: '로그인 성공',
      accessToken,
    };
  }
}
