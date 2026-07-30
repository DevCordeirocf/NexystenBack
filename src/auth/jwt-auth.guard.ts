import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow unauthenticated access if there is no
    // Authorization header. If an Authorization header is present, delegate
    // to the passport JWT strategy so request.user is populated when the token
    // is valid.
    const request = context.switchToHttp().getRequest();
    const authHeader = request?.headers?.authorization || request?.headers?.Authorization;

    if (isPublic && !authHeader) {
      return true;
    }

    return super.canActivate(context);
  }
}
