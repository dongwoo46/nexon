import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginReqDto, LoginResDto } from '@libs/dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from '../../../../libs/constants/user-status.constant';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginReqDto): Promise<LoginResDto> {
    try {
      const user = await this.userModel.findOne({ email: dto.email });

      if (!user) {
        throw new RpcException(new NotFoundException('존재하지 않는 사용자입니다.'));
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw new RpcException(new UnauthorizedException('사용할 수 없는 사용자입니다.'));
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new RpcException(new UnauthorizedException('비밀번호가 올바르지 않습니다.'));
      }

      // 출석 로직
      if (user.role === 'USER') {
        const now = new Date();
        const today = dayjs(now).format('YYYY-MM-DD');
        const yesterday = dayjs(now).subtract(1, 'day').format('YYYY-MM-DD');
        const sortedAttendanceDate = [...user.attendanceDates].sort();
        const lastAttendance = sortedAttendanceDate.at(-1);

        if (!user.attendanceDates.includes(today)) {
          user.attendanceDates.push(today);

          if (lastAttendance === yesterday) {
            user.continuousAttendanceCount += 1;
          } else {
            user.continuousAttendanceCount = 1;
          }

          user.points += 10;

          if (user.continuousAttendanceCount > 0 && user.continuousAttendanceCount % 7 === 0) {
            user.points += 20;
          }
        }
      }

      await user.save();

      const payload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
        jti: uuidv4(),
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        statusCode: HttpStatus.OK,
        message: '로그인 성공',
        accessToken,
      };
    } catch (error) {
      throw new RpcException(
        new UnauthorizedException(`로그인 처리 중 오류 발생: ${error.message}`),
      );
    }
  }
}
