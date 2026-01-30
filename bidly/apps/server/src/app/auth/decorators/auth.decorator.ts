import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { UserRole } from '@common';

export const ROLES_KEY = Symbol('roles');

export const Auth = (...args: UserRole[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, args),
    ApiBearerAuth(),
    UseGuards(AuthGuard, RoleGuard),
  );
};
