import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  // async signup(reqSignupDto: ReqSignupDto, ip: string) {
  //   return await this.administratorService.signup(reqSignupDto, ip);
  // }

  // async login(reqLoginDto: ReqLoginDto) {
  //   const admin = await this.administratorService.findOneByAdminName(reqLoginDto.administratorName);

  //   if (!admin) {
  //     throw new NotFoundException('관리자가 존재하지 않습니다.');
  //   }

  //   return admin;
  // }

  // async logout() {
  //   //todo 세션id 쿠키에서 삭제, 세션id 만료
  // }

  // async validatePassword(administratorName: string, password: string): Promise<boolean> {
  //   const admin = await this.administratorService.findOneByAdminName(administratorName);
  //   if (!admin) {
  //     throw new NotFoundException('admin not found');
  //   }
  //   const activePassword = admin.password.find((pw) => pw.active === 1);
  //   const passwordHash = activePassword.passwordHash;
  //   return await bcrypt.compare(password, passwordHash);
  // }
}
