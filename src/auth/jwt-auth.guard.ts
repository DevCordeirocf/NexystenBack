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
    const headers: Record<string, any> = request?.headers || {};
    // Lookup the Authorization header case-insensitively to avoid bypasses from unusual casing
    let authHeader: string | undefined = undefined;
    if (headers['authorization']) {
      authHeader = headers['authorization'];
    } else {
      const foundKey = Object.keys(headers).find((k) => k && k.toLowerCase() === 'authorization');
      if (foundKey) {
        authHeader = headers[foundKey];
      }
    }

    if (isPublic && !authHeader) {
      return true;
    }

    return super.canActivate(context);
  }
}
