import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/application/auth.service';
import { AuthController } from '../src/interfaces/controllers/auth.controller';

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
