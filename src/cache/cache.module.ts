import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheInvalidationService } from './cache-invalidation.service';

import { REDIS_CLIENT } from './cache.constants';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        if (process.env.CACHE_ENABLED !== 'true') {
          return null;
        }
        return new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
      }
    },
    CacheInvalidationService
  ],
  exports: [REDIS_CLIENT, CacheInvalidationService]
})
export class CacheModule {}
