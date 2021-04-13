import { SetMetadata } from '@nestjs/common';
import { Roles as RoleEnum } from '@mar.io/models'

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);