import { Controller } from '@nestjs/common';
import { UserService } from '../../application/user.service';
import { SignUpReqDto } from '../../../../../libs/dto/src/auth/request/signup-req.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignUpResDto } from '../../../../../libs/dto/src/auth/response/signup-res.dto';
import { UserMessagePatternConst } from '@libs/constants';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMessagePatternConst.USER_SIGNUP)
  async handleSignup(@Payload() dto: SignUpReqDto): Promise<SignUpResDto> {
    try {
      return await this.userService.createUser(dto);
    } catch (err) {
      throw err;
    }
  }
}
