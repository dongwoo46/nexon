import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello() {
    // return this.authService.getHello();
  }
}
