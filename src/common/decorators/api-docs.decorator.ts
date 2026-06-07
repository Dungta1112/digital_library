import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiProtected() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Authentication required or invalid token' }),
    ApiForbiddenResponse({ description: 'Role or ownership permission denied' })
  );
}
