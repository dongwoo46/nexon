import { Controller, Get } from '@nestjs/common';
<<<<<<<< HEAD:apps/auth/src/interfaces/controllers/auth.controller.ts
import { AuthService } from '../../application/auth.service';
========
import { AuthService } from '../application/auth.service';
>>>>>>>> 4b1c970614f05e32d2d19b7856f4629486e0d8c1:apps/auth/src/interfaces/auth.controller.ts

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello() {
    // return this.authService.getHello();
  }
}
