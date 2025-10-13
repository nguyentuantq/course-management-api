import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const required = this.reflector.get<string[]>('roles', ctx.getHandler()) || [];
    if (!required.length) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !required.includes(user.role)) throw new ForbiddenException('Insufficient role');
    return true;
  }
}
