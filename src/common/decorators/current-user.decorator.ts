import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestUser {
  id: string;
  roles?: string[];
  permissions?: string[];
}

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): RequestUser | undefined => {
  return ctx.switchToHttp().getRequest<{ user?: RequestUser }>().user;
});
