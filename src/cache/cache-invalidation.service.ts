import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './cache.constants';

@Injectable()
export class CacheInvalidationService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis | null) {}

  async invalidateDocumentViews() {
    await this.deleteByPattern('documents:*');
    await this.deleteByPattern('statistics:*');
  }

  async invalidateModerationViews() {
    await this.deleteByPattern('content:*');
    await this.deleteByPattern('statistics:*');
  }

  private async deleteByPattern(pattern: string) {
    if (!this.redis) {
      return;
    }
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
