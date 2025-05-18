import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/application/auth.service';
<<<<<<< HEAD
import { AuthController } from '../src/interfaces/controllers/auth.controller';
=======
import { AuthController } from '../src/interfaces/auth.controller';
>>>>>>> 4b1c970614f05e32d2d19b7856f4629486e0d8c1

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authController.getHello()).toBe('Hello World!');
    });
  });
});
