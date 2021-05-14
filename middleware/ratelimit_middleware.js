const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const redis = require("redis");

const connectionString =
  process.env.QOVERY_DATABASE_MY_REDIS_CONNECTION_URI ||
  "redis://:@localhost:6379";

const limitStore = new RedisStore({
    client: redis.createClient((redis_url = connectionString)),
  }),
  rateLimiterPrimary = rateLimit({
    store: limitStore,
    windowMs: 60 * 60 * 1000,
    max: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  });

rateLimiterSecondary = rateLimit({
  store: limitStore,
  windowMs: 60 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});
module.exports = { rateLimiterPrimary, rateLimiterSecondary };
