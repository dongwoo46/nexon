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
import * as dayjs from 'dayjs';

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
      throw new RpcException(new UnauthorizedException('비밀번호가 올바르지 않습니다.'));
    }

    // === 출석정보 비즈니스 로직 ===
    // USER만 출석 정보 업데이트 ADMIN, OPERATOR, AUDITOR 출석 정보 업데이트X
    if (user.role === 'USER') {
      const now = new Date();
      const today = dayjs(now).format('YYYY-MM-DD');
      const yesterday = dayjs(now).subtract(1, 'day').format('YYYY-MM-DD');
      const sortedAttendanceDate = [...user.attendanceDates].sort(); // 시간순 정렬
      const lastAttendance = sortedAttendanceDate.at(-1);

      // 오늘 출석 기록이 없으면 → 출석 인정
      if (!user.attendanceDates.includes(today)) {
        user.attendanceDates.push(today);

        // 연속 출석 판정
        if (lastAttendance === yesterday) {
          user.continuousAttendanceCount += 1;
        } else {
          user.continuousAttendanceCount = 1;
        }

        // 포인트 지급
        user.points += 10;

        // 연속 출석이 7의 배수라면 추가 포인트
        if (user.continuousAttendanceCount > 0 && user.continuousAttendanceCount % 7 === 0) {
          user.points += 20;
        }
      }
    }

    await user.save();

    // === jwt 발급 ===
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      jti: uuidv4(), // jwt 로그인마다 다른 jwt 발급
    };

    const accessToken = this.jwtService.sign(payload);

    const response: LoginResDto = {
      statusCode: HttpStatus.OK,
      message: '로그인 성공',
      accessToken,
    };

    return response;
  }
}
