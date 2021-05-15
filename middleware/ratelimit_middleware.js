const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const redis = require("redis");
const { connectionString } = require("../config");

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
