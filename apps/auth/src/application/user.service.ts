import {
  Injectable,
  BadRequestException,
  HttpStatus,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/schemas/user.schema';
import { SignUpReqDto, SignUpResDto } from '@libs/dto';
import { RpcException } from '@nestjs/microservices';
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
   * 회원가입 시 sms 인증, 이메일 인증 등 본인확인 인증으로 사용자 체크 필요
   */
  async createUser(dto: SignUpReqDto): Promise<SignUpResDto> {
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      const exists = await this.userModel.findOne({ email: dto.email }).session(session);
      if (exists) {
        throw new RpcException(new ConflictException('이미 존재하는 이메일입니다.'));
      }

      // 관리자 권한 제한
      if (['ADMIN', 'AUDITOR', 'OPERATOR'].includes(dto.role)) {
        let expectedKey = '';
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
          throw new RpcException(
            new ForbiddenException(`${dto.role}으로 회원가입 권한이 없습니다.`),
          );
        }
      }

      if (dto.password !== dto.confirmPassword) {
        throw new RpcException(new BadRequestException('비밀번호가 일치하지 않습니다.'));
      }

      const newUser = await User.signUpUser(dto);

      if (dto.inviteCode) {
        const inviter = await this.userModel.findById(dto.inviteCode).session(session);
        if (!inviter) {
          throw new RpcException(new BadRequestException('유효하지 않은 초대 코드입니다.'));
        }

        newUser.invitedBy = inviter._id;

        await this.userModel.updateOne(
          { _id: inviter._id },
          { $inc: { inviteCount: 1 } },
          { session },
        );
      }

      const createdUser = new this.userModel(newUser);
      await createdUser.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        statusCode: HttpStatus.CREATED,
        message: '회원가입이 완료되었습니다.',
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw new RpcException(new BadRequestException(`회원가입 실패: ${error.message}`));
    }
  }
}
