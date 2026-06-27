process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret';
process.env.BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS ?? '4';
process.env.STORAGE_DRIVER = process.env.STORAGE_DRIVER ?? 'local';
process.env.LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH ?? './tmp/test-storage';
process.env.CACHE_ENABLED = process.env.CACHE_ENABLED ?? 'false';
