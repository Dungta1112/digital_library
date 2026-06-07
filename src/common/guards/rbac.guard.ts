import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]) ?? [];
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]) ?? [];
    if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
      return true;
    }
    const user = context.switchToHttp().getRequest<{ user?: { roles?: string[]; permissions?: string[] } }>().user;
    const roles = user?.roles ?? [];
    const permissions = user?.permissions ?? [];
    const hasRole = requiredRoles.length === 0 || requiredRoles.some((role) => roles.includes(role));
    const hasPermission = requiredPermissions.length === 0 || requiredPermissions.some((permission) => permissions.includes(permission));
    if (!hasRole || !hasPermission) {
      throw new ForbiddenException('Permission denied');
    }
    return true;
  }
}
