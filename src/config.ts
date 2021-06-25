export const secret: string = process.env.SECRET || "secretkey";
export const PORT = process.env.PORT || 3000;
export const DB_URL: string =
  process.env.DB_URL || "mongodb://localhost:27017/yapb";
export const env: string = process.env.NODE_ENV || "production";
export const connectionString: string =
  process.env.REDIS_DB_URI ||
  process.env.QOVERY_DATABASE_RATE_LIMIT_CONNECTION_URI ||
  "redis://:@localhost:6379";
