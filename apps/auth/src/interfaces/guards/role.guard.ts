import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../../domain/types/role.type';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private readonly userService: UserService, // UsersService를 주입받습니다.
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    // const nowUser = await this.membersService.findOneByEmail(user.email);
    // if (!nowUser) {
    //   return false;
    // }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      return false;
    }
    return hasRole;
  }
}
