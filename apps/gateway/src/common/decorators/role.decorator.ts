import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../../../auth/src/domain/types/role.type';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLE_KEY, roles);
