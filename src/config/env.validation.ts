export interface EnvConfig {
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  BCRYPT_ROUNDS: string;
  STORAGE_DRIVER: 'local' | 'minio';
}

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  }
  return {
    DATABASE_URL: String(config.DATABASE_URL),
    JWT_ACCESS_SECRET: String(config.JWT_ACCESS_SECRET),
    JWT_REFRESH_SECRET: String(config.JWT_REFRESH_SECRET),
    BCRYPT_ROUNDS: String(config.BCRYPT_ROUNDS ?? '12'),
    STORAGE_DRIVER: (config.STORAGE_DRIVER === 'minio' ? 'minio' : 'local')
  };
}
