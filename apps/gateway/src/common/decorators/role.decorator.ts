import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../../../../libs/constants/role.constant';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLE_KEY, roles);
