import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: { id?: string }; params: Record<string, string>; body: Record<string, string> }>();
    const ownerId = request.body.ownerId ?? request.params.userId;
    if (!ownerId || request.user?.id === ownerId) {
      return true;
    }
    throw new ForbiddenException('Only the owner can perform this action');
  }
}
