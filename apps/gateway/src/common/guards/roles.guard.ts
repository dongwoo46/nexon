import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';
import { RoleType } from '@libs/constants/role.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 역할 제한 없을 시 통과
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('로그인이 필요합니다.');
    }

    // ADMIN이면 무조건 통과(모든 기능 사용)
    if (user.role === 'ADMIN') {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
    return hasRole;
  }
}
