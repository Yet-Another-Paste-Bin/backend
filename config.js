const secret = process.env.SECRET || "secretkey";
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/yapb";
const env = process.env.NODE_ENV || "production";
const frontendUrl = process.env.FRONTEND_URL;
const connectionString =
  process.env.REDIS_DB_URI ||
  process.env.QOVERY_DATABASE_RATE_LIMIT_CONNECTION_URI ||
  "redis://:@localhost:6379";

module.exports = { secret, PORT, DB_URL, env, frontendUrl, connectionString };
