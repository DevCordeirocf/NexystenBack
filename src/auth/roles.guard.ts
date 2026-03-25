import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No roles specified, access granted
    }
    const { user } = context.switchToHttp().getRequest();
    // If user is not authenticated, JwtAuthGuard should have already blocked it.
    // Here, we check if the user has any of the required roles.
    return requiredRoles.some((role) => user.role === role);
  }
}
