import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
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
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // If user is not authenticated, JwtAuthGuard should have already blocked it.
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    // Normalize types and check roles
    const userRole = String(user.role);
    const allowed = requiredRoles.map((r) => String(r)).includes(userRole);
    if (!allowed) {
      throw new ForbiddenException('Acesso negado: role insuficiente');
    }
    return true;
  }
}
